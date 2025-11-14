import express from 'express'
import { registerUser , loginUser , BuyCoupon} from '../controller/userController.js'
const userRouter = express.Router()
userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.post('/buy' , BuyCoupon)
export default userRouter