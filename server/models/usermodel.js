import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true },
  restaurantId: { type: String },
  restaurantName: { type: String },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, default: "active" }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  coupons: [couponSchema]   // Correct nested schema
});

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
