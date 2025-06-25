
const express=require('express')
const {registerDoctor}=require('../controller/doctorController.js')

const doctorRouter=express.Router()

// Public registration route for doctor

doctorRouter.post('/register',registerDoctor)

module.exports=doctorRouter;