// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/mongodb.js';

import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import appointmentRouter from './routes/appointmentRoute.js';
import adminRouter from './routes/adminRoute.js';
import visitRouter from './routes/visitRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';
import profileRouter from './routes/profileRoute.js';
import forgotpRouter from './routes/forgotpRoute.js';
import chartRouter from './routes/chartRoute.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve('uploads')));

app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/visit', visitRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/profile', profileRouter);
app.use('/api/forgotp', forgotpRouter);
app.use('/api/chart', chartRouter);

app.get('/', (req, res) => res.send('API WORKING Great'));

app.listen(port, () => console.log(`🚀 Server started on http://localhost:${port}`));
