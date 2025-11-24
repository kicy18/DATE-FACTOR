import express from 'express';
import {
  listRestaurants,
  createRestaurant,
  deleteRestaurant
} from '../controller/restaurantController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/', protect, requireAdmin, listRestaurants);
restaurantRouter.post('/', protect, requireAdmin, createRestaurant);
restaurantRouter.delete('/:id', protect, requireAdmin, deleteRestaurant);

export default restaurantRouter;

