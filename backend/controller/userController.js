const validator =require("validator")
const bcrypt =require("bcryptjs")
const userModel=require("../models/userModel.js")
const doctorModel = require("../models/doctorModel.js");
const jwt=require('jsonwebtoken')

const registerUser= async(req,res)=>{
  try{
    const {username,email,password}=req.body
    if(!username || !password || !email){
        return res.status(400).json({success:false,message:"Missing Details"})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false,message:"Enter a valid email"})
    }
    if(password.length < 8){
        return res.status(400).json({success:false,message:'Enter a strong password'})
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password,salt)
    const userData={ username, email, password:hashedPassword }
    const newUser=new userModel(userData)
    const user=await newUser.save()
    const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET)
    res.json({success:true,token,role:user.role})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET);
      return res.status(200).json({ success: true, token, role: "admin" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    if (user.role === "doctor") {
      const doctor = await doctorModel.findOne({ userId: user._id });
      if (!doctor) {
        return res.status(403).json({ success: false, message: "Doctor profile not found" });
      }
      if (!doctor.approved) {
        return res.status(403).json({ success: false, message: "Your registration is pending admin approval" });
      }
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token, role: user.role });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser };