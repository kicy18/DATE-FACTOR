import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true }, // acts as display address
    priceMale: { type: Number, default: 399 },
    priceFemale: { type: Number, default: 199 },
    image: { type: String }, // optional
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

const restaurantModel =
  mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;
