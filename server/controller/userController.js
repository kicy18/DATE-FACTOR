import userModel from "../models/usermodel.js";
import restaurantModel from "../models/restaurantmodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import razorpay from 'razorpay';
import QRCode from "qrcode";
import nodemailer from 'nodemailer';
const registerUser = async (req , res)=>{
    try {
        const {name , phone , gender , email , password} = req.body ;
        if(!name || !email || !password){
            return res.json({success:false , message:'Missing Details' })
        }
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false , message:'User already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)
        const userData = {
            name,
            phone,
            gender,
            email,
            password: hashedPassword,
            role: 'user'
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                gender: user.gender,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}
const loginUser = async (req , res) =>{
    try {
        const {email , password} = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false , message:'User does not exist' })
        }
        const isMatch = await bcrypt.compare(password , user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({
                success: true,
                token,
                user: {
                    name: user.name,
                    gender: user.gender,
                    email: user.email,
                    role: user.role
                }
            });


        }
        else{
            return res.json({success:false , message:'Invalid Credentials' })
        }
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}


const createMailTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

const BuyCoupon = async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Select amount based on gender
    let amount;
    if (user.gender === "male") amount = 399;
    else if (user.gender === "female") amount = 199;
    else amount = 299; // Optional: default if gender unspecified

    // Generate UPI Payment QR
    const upiId = process.env.UPI_ID;
    if (!upiId) {
      return res
        .status(500)
        .json({ success: false, message: "Payment UPI ID is not configured on the server." });
    }

    const upiLink = `upi://pay?pa=${upiId}&pn=DateFactor&am=${amount}&cu=INR&tn=CouponPayment`;



  } catch (err) {
    console.error(err);
  }
};

// Email service configuration
const sendEmailToAdmin = async (user, coupon, paymentScreenshot) => {
  try {
    const transporter = createMailTransporter();

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.MANAGE_EMAIL,
      subject: 'New Coupon Generated - Payment Validation Required',
      html: `
        <h2>New Coupon Generated</h2>
        <h3>User Information:</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Gender:</strong> ${user.gender}</p>
        
        <h3>Coupon Details:</h3>
        <p><strong>Coupon Code:</strong> ${coupon.couponCode}</p>
        <p><strong>Restaurant Name:</strong> ${coupon.restaurantName}</p>
        <p><strong>Amount Paid:</strong> ₹${coupon.amount}</p>
        <p><strong>Purchase Date:</strong> ${coupon.purchaseDate.toLocaleDateString()}</p>
        <p><strong>Expiry Date:</strong> ${coupon.expiryDate.toLocaleDateString()}</p>
        
        <h3>Payment Screenshot:</h3>
        <img src="${paymentScreenshot}" alt="Payment Screenshot" style="max-width: 600px;" />
        
        <p>Please validate the payment and update the coupon status accordingly.</p>
      `,
      attachments: paymentScreenshot ? [{
        filename: 'payment-screenshot.png',
        content: paymentScreenshot.includes('base64,') 
          ? paymentScreenshot.split('base64,')[1] 
          : paymentScreenshot.replace(/^data:image\/\w+;base64,/, ''),
        encoding: 'base64'
      }] : []
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent to admin successfully');
  } catch (error) {
    console.error('Error sending email to admin:', error);
    throw error;
  }
};

const sendCouponValidatedEmail = async (user, coupon) => {
  try {
    const transporter = createMailTransporter();
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Your Date Factor coupon is active',
      html: `
        <h2>Coupon Activated</h2>
        <p>Hi ${user.name},</p>
        <p>Your coupon <strong>${coupon.couponCode}</strong> is now <strong>Active</strong>.</p>
        <ul>
          <li>Restaurant: ${coupon.restaurantName || 'Assigned partner restaurant'}</li>
          <li>Valid until: ${coupon.expiryDate?.toLocaleDateString()}</li>
          <li>Status: ${coupon.status}</li>
        </ul>
        <p>Show this coupon code at the venue to enjoy your date experience.</p>
        <p>Love,<br/>Team Date Factor</p>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('Coupon activation email sent to user');
  } catch (error) {
    console.error('Error sending coupon activation email:', error);
    throw error;
  }
};

const submitPayment = async (req, res) => {
  try {
    const { userEmail, paymentScreenshot } = req.body;

    if (!userEmail || !paymentScreenshot) {
      return res.status(400).json({ success: false, message: "Missing user email or payment screenshot" });
    }

    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get all active restaurants
    const restaurants = await restaurantModel.find({ isActive: true });
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ success: false, message: "No restaurants available" });
    }

    // Select random restaurant
    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];

    // Select amount based on gender
    let amount;
    if (user.gender === "male") amount = 399;
    else if (user.gender === "female") amount = 199;
    else amount = 299;

    // Generate random coupon code
    const couponCode = "DATE" + Math.floor(100 + Math.random() * 900);

    // Expiry date after 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Create coupon
    const newCoupon = {
      couponCode,
      restaurantId: randomRestaurant._id.toString(),
      restaurantName: randomRestaurant.name,
      purchaseDate: new Date(),
      expiryDate,
      status: "pending_validation",
      amount
    };

    // Add coupon to user
    user.coupons.push(newCoupon);
    await user.save();

    // Send email to admin
    try {
      await sendEmailToAdmin(user, newCoupon, paymentScreenshot);
    } catch (emailError) {
      console.error('Email sending failed, but coupon created:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: "Payment submitted successfully. Coupon generated and admin notified.",
      coupon: {
        couponCode: newCoupon.couponCode,
        restaurantName: newCoupon.restaurantName,
        purchaseDate: newCoupon.purchaseDate,
        expiryDate: newCoupon.expiryDate,
        status: newCoupon.status,
        amount: newCoupon.amount
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error processing payment", error: err.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    if (!couponCode) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const user = await userModel.findOne({ "coupons.couponCode": couponCode });
    if (!user) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const coupon = user.coupons.find(item => item.couponCode === couponCode);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    if (coupon.status === "active") {
      return res.status(400).json({ success: false, message: "Coupon already active" });
    }

    coupon.status = "active";
    await user.save();

    try {
      await sendCouponValidatedEmail(user, coupon);
    } catch (emailError) {
      console.error('Failed to send activation email to user:', emailError);
    }

    res.json({
      success: true,
      message: "Coupon validated successfully",
      coupon: {
        couponCode: coupon.couponCode,
        status: coupon.status,
        restaurantName: coupon.restaurantName,
        expiryDate: coupon.expiryDate,
        customer: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          phone: user.phone
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error validating coupon", error: err.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    if (!couponCode) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const user = await userModel.findOne({ "coupons.couponCode": couponCode });
    if (!user) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const couponIndex = user.coupons.findIndex(item => item.couponCode === couponCode);
    if (couponIndex === -1) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    user.coupons.splice(couponIndex, 1);
    await user.save();

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting coupon", error: err.message });
  }
};

const markCouponUsed = async (req, res) => {
  try {
    const { couponCode } = req.body;
    if (!couponCode) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const user = await userModel.findOne({ "coupons.couponCode": couponCode });
    if (!user) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const coupon = user.coupons.find(item => item.couponCode === couponCode);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    if (coupon.status !== "active") {
      return res.status(400).json({ success: false, message: "Only active coupons can be marked as used" });
    }

    coupon.status = "used";
    await user.save();

    res.json({
      success: true,
      message: "Coupon marked as used",
      coupon: {
        couponCode: coupon.couponCode,
        status: coupon.status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating coupon", error: err.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const { restaurantId, search = "" } = req.query;

    if (!restaurantId && !search) {
      return res.status(400).json({
        success: false,
        message: "Provide at least restaurantId or a search term."
      });
    }

    const searchValue = search.trim();
    const searchRegex = searchValue ? new RegExp(searchValue, "i") : null;

    const query = restaurantId ? { "coupons.restaurantId": restaurantId } : {};

    const users = await userModel.find(query, {
      name: 1,
      email: 1,
      gender: 1,
      phone: 1,
      coupons: 1
    });

    const coupons = [];

    users.forEach(user => {
      user.coupons.forEach(coupon => {
        const matchesRestaurant = restaurantId ? coupon.restaurantId === restaurantId : true;
        const matchesSearch =
          !searchRegex ||
          searchRegex.test(coupon.couponCode) ||
          searchRegex.test(user.name) ||
          searchRegex.test(user.email);

        if (matchesRestaurant && matchesSearch) {
          coupons.push({
            couponCode: coupon.couponCode,
            restaurantId: coupon.restaurantId,
            restaurantName: coupon.restaurantName,
            purchaseDate: coupon.purchaseDate,
            expiryDate: coupon.expiryDate,
            status: coupon.status,
            customer: {
              name: user.name,
              email: user.email,
              gender: user.gender,
              phone: user.phone
            }
          });
        }
      });
    });

    return res.json({ success: true, coupons });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export  {registerUser , loginUser , BuyCoupon, getCoupons, submitPayment, validateCoupon, deleteCoupon, markCouponUsed }
