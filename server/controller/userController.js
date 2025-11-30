import userModel from "../models/usermodel.js";
import restaurantModel from "../models/restaurantmodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend';
import { sendEmail } from "../utility/email.js"

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
   



  } catch (err) {
    console.error(err);
  }
};

// Email service configuration
const sendEmailToAdmin = async (user, coupon, screenshot) => {
  const html = `
    <h2>New Coupon Generated</h2>
    <p><b>Name:</b> ${user.name}</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>Phone:</b> ${user.phone}</p>

    <h3>Coupon Details</h3>
    <p><b>Code:</b> ${coupon.couponCode}</p>
    <p><b>Restaurant:</b> ${coupon.restaurantName}</p>
    <p><b>Amount:</b> ₹${coupon.amount}</p>
    <p><b>Expiry:</b> ${coupon.expiryDate.toDateString()}</p>

    ${screenshot ? `<img src="${screenshot}" width="300"/>` : ""}
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Coupon — Validate Payment",
    html
  });
};
const sendCouponValidatedEmail = async (user, coupon) => {
  // Fetch restaurant details to get address
  let restaurantAddress = 'Address not available';
  if (coupon.restaurantId) {
    try {
      const restaurant = await restaurantModel.findById(coupon.restaurantId);
      if (restaurant && restaurant.location) {
        restaurantAddress = restaurant.location;
      }
    } catch (err) {
      console.error('Error fetching restaurant address:', err);
    }
  }

  const html = `
    <h2>Your Coupon is Activated 🎉</h2>
    <p>Hi ${user.name},</p>
    <p>Your coupon <b>${coupon.couponCode}</b> is now active.</p>
    <p><b>Restaurant:</b> ${coupon.restaurantName}</p>
    <p><b>Address:</b> ${restaurantAddress}</p>
    <p><b>Valid until:</b> ${coupon.expiryDate.toDateString()}</p>
    <p>Enjoy your date ❤️</p>
    <p><b>- Team Date Factor</b></p>
  `;

  return sendEmail({
    to: user.email,
    subject: "Your Coupon is Active 🎉",
    html
  });
};


const submitPayment = async (req, res) => {
  try {
    const { userEmail, paymentScreenshot } = req.body;

    if (!userEmail || !paymentScreenshot)
      return res.status(400).json({ success: false, message: "Missing details" });

    const user = await userModel.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const restaurants = await restaurantModel.find({ isActive: true });
    if (restaurants.length === 0)
      return res.status(404).json({ success: false, message: "No restaurants available" });

    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];

    const amount = user.gender === "male" ? 399 : user.gender === "female" ? 199 : 299;

    const couponCode = "DATE" + Math.floor(1000 + Math.random() * 9000);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newCoupon = {
      couponCode,
      restaurantId: randomRestaurant._id.toString(),
      restaurantName: randomRestaurant.name,
      purchaseDate: new Date(),
      expiryDate,
      status: "pending_validation",
      amount,
    };

    user.coupons.push(newCoupon);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Payment submitted. Admin notified.",
      coupon: newCoupon,
    });

    sendEmailToAdmin(user, newCoupon, paymentScreenshot).catch(err => {
  console.error("❌ Failed to send admin email:", err);
});


  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const user = await userModel.findOne({ "coupons.couponCode": couponCode });
    if (!user) return res.status(404).json({ success: false, message: "Coupon not found" });

    const coupon = user.coupons.find(c => c.couponCode === couponCode);

    coupon.status = "active";
    await user.save();

    sendCouponValidatedEmail(user, coupon).catch(err => {
  console.error("❌ Failed to send user email:", err);
});


    res.json({
      success: true,
      message: "Coupon validated",
      coupon,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    // Build query - use string comparison for restaurantId to handle ObjectId properly
    const query = restaurantId ? { "coupons.restaurantId": restaurantId.toString() } : {};

    const users = await userModel.find(query, {
      name: 1,
      email: 1,
      gender: 1,
      phone: 1,
      coupons: 1
    });

    const coupons = [];
    const restaurantIdString = restaurantId ? restaurantId.toString() : null;

    users.forEach(user => {
      user.coupons.forEach(coupon => {
        // Compare restaurantId as strings to ensure proper matching
        const couponRestaurantId = coupon.restaurantId?.toString();
        const matchesRestaurant = restaurantIdString 
          ? couponRestaurantId === restaurantIdString 
          : true;
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
