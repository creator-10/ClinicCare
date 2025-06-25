const express=require("express")
const cors=require("cors");
const connectDB = require("./config/mongodb.js");
const userRouter=require("./routes/userRoute.js")
const doctorRouter=require('./routes/doctorRoute.js')
const adminRouter=require('./routes/adminRoute.js')
const visitRouter = require('./routes/visitRoute.js');
require("dotenv").config()

const app=express();
const port=process.env.PORT;
connectDB()

app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/admin',adminRouter)
app.use('/api/visit', visitRouter);

app.get('/',(req,res)=>{
    res.send('API WORKING Great')
})
app.listen(port,()=>console.log("Server Started",port))