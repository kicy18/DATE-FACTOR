import express from 'express'
import { registerUser , loginUser , BuyCoupon, getCoupons, submitPayment, validateCoupon, deleteCoupon, markCouponUsed} from '../controller/userController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'
const userRouter = express.Router()
userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.post('/buy' , BuyCoupon)
userRouter.post('/submit-payment' , submitPayment)
userRouter.get('/coupons' , getCoupons)
userRouter.post('/validate-coupon' , protect, requireAdmin, validateCoupon)
userRouter.post('/reject-coupon' , protect, requireAdmin, deleteCoupon)
userRouter.post('/mark-used-coupon' , protect, requireAdmin, markCouponUsed)
export default userRouter