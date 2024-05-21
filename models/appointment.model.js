import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  donor: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
}, { timestamps: true });

const appointmentModel = new mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;