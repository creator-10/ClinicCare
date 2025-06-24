const mongoose= require('mongoose')

const doctorSchema=new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    specialization:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    experience:{type:String,required:true},
    approved:{type:Boolean,default:false}
},{timestamps:true,minimize:false})

const doctorModel=mongoose.models.doctor || mongoose.model('doctor',doctorSchema)
module.exports=doctorModel