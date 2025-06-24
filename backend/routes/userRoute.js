
const express=require('express')
const { loginUser, registerUser } =require('../controller/userController.js')

const userRouter=express.Router()

// Public routes
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

// Protected routes

module.exports=userRouter
