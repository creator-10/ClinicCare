import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  availabilitySlots: [{ type: String }],
  approved: { type: Boolean, default: false }
}, { timestamps: true, minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);
export default doctorModel;
