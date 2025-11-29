import restaurantModel from '../models/restaurantmodel.js';
import userModel from '../models/usermodel.js';

const normalizePrice = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? fallback : numeric;
};

const normalizeRestaurantPayload = (payload = {}) => {
  const { name = '', location = '', priceMale, priceFemale } = payload;
  return {
    name: name.trim(),
    location: location.trim(),
    priceMale: normalizePrice(priceMale, 399),
    priceFemale: normalizePrice(priceFemale, 199)
  };
};

export const listRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find().sort({ createdAt: -1 });
    res.json({ success: true, restaurants });
  } catch (error) {
    console.error('Error listing restaurants:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const payload = normalizeRestaurantPayload(req.body);
    if (!payload.name || !payload.location ) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and address  are required' });
    }

    const restaurant = await restaurantModel.create(payload);
    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ success: false, message: 'Failed to create restaurant' });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Restaurant id missing' });
    }

    const restaurant = await restaurantModel.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Delete all coupons associated with this restaurant
    const restaurantIdString = id.toString();
    const users = await userModel.find({ "coupons.restaurantId": restaurantIdString });
    
    for (const user of users) {
      user.coupons = user.coupons.filter(
        coupon => coupon.restaurantId?.toString() !== restaurantIdString
      );
      await user.save();
    }

    res.json({ success: true, message: 'Restaurant and associated coupons deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ success: false, message: 'Failed to delete restaurant' });
  }
};

