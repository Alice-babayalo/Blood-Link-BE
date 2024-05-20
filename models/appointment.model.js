import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
}, { timestamps: true });

const appointmentModel = new mongoose.model('appointment', appointmentSchema);

export default appointmentModel;