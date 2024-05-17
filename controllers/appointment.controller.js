
import appointmentModel from "../models/appointment.model.js";
import donorModel from "../models/donor.model.js";
import hospitalModel from "../models/hospital.model.js";
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';

export const createAppointment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }
    try {
      const { donorName, date, time, hospitalName } = req.body;
      const donor = await donorModel.findOne({fullName: donorName});
      if (!donor) {
        return next(new BadRequestError('Donor not found'));
      }
  
      const hospital = await hospitalModel.findOne({ name: hospitalName });
      if (!hospital) {
        return next(new BadRequestError('Hospital not found'));
      }
  
      const appointment = new appointmentModel({
        donor: donor._id,
        date,
        time,
        hospital: hospital._id,
        status: 'pending'
      });
      await appointment.save();
      res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const listAppointments = async (req, res) => {
    try {
      const appointments = await appointmentModel.find().populate('donor').populate('hospital');
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getAppointmentById = async (req, res) => {
    try {
      const appointment = await appointmentModel.findById(req.params.id).populate('donor').populate('hospital');
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const confirmAppointment = async (req, res) => {
    try {
      const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.status(200).json({ message: 'Appointment confirmed successfully', appointment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const rejectAppointment = async (req, res) => {
    try {
      const { rejectionReason } = req.body;
      const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason }, { new: true });
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.status(200).json({ message: 'Appointment rejected successfully', appointment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const updateAppointment = async (req, res) => {
    try {
      const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


