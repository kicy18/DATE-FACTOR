import userModel from "../models/usermodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from "crypto";
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
            name ,phone , gender, email , password : hashedPassword
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
                email: user.email
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
                    email: user.email
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
    const { userEmail, restaurantName } = req.body;

    // find the user
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate unique coupon code
    const couponCode = "DATE" + crypto.randomBytes(3).toString("hex").toUpperCase();

    // set expiry (1 week later)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // add coupon to user’s coupons array
    const newCoupon = {
      couponCode,
      restaurantName,
      purchaseDate: new Date(),
      expiryDate,
      status: "active"
    };

    user.coupons.push(newCoupon);
    await user.save();

    res.status(201).json({
      message: "Coupon generated successfully!",
      coupon: newCoupon
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating coupon", error: err.message });
  }
};

export  {registerUser , loginUser , BuyCoupon } 