import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coupons: [{
    couponCode: { type: String, required: true, unique: true },
    restaurantName: String,
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: Date,
    status: { type: String, default: "active" }
  }]
});

const userModel =
    mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;