const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({

    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
     contact:{
        type:String,
        default:"0000000000"
    },

    role:{
        type:String,
        enum:["admin","doctor","patient"],
        default:"patient"
    },

   
},{timestamps:true, minimize:false});

const userModel=mongoose.models.user || mongoose.model('user',userSchema)
module.exports=userModel;