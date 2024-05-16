import donorModel from "../models/donor.model.js";
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';




// Controller methods
export const createAppointment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
  try {
    const { fullName, mobileNumber, nationalID, email, province, district, sector, bloodGroup, age, gender } = req.body;
    
    const donor = new donorModel({
      fullName,
      mobileNumber,
      nationalID,
      email,
      province,
      district,
      sector,
      bloodGroup,
      age,
      gender
    });

    await donor.save();
    res.status(201).json({ message: 'Appointment created successfully', donor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listAppointments = async (req, res) => {
  try {
    const appointments = await Donor.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Donor.findById(req.params.id);
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
    const appointment = await Donor.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
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
    const appointment = await Donor.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason }, { new: true });
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
    const appointment = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
