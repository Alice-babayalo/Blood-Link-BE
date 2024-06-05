
import appointmentModel from "../models/appointment.model.js";
import donorModel from "../models/donor.model.js";
import hospitalModel from "../models/hospital.model.js";
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';
import { sendEmail } from "../utils/sendEmail.js";
import asyncWrapper from "../middleware/async.js";

export const createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }

  try {
    const { donor, date, time, hospital } = req.body;

    const donorApp = await donorModel.findById(donor);
    if (!donorApp) {
      return next(new BadRequestError('Donor not found'));
    }

    const hospitalApp = await hospitalModel.findById(hospital);
    if (!hospitalApp) {
      return next(new BadRequestError('Hospital not found'));
    }

    const appointment = await appointmentModel.create(req.body);
    

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    next(error);
  }
};  
  export const listAppointments = async (req, res) => {
    try {
      const Appointments = await appointmentModel.find({ status: 'confirmed' }).populate('hospital').populate('donor');

      const validAppointments = Appointments.filter(appointment => appointment.donor && appointment.hospital);
  
      res.status(200).json({
        numberOfAppointments: validAppointments.length,
        Appointments: validAppointments
      });
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
  
  export const confirmAppointment = async (req, res, next) => {
    try {
      const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true }).populate('donor').populate('hospital');
      if (appointment.status === 'confirmed') {
        return next(new BadRequestError('Appointment is already confirmed'));
      }
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      appointment.save();
      res.status(200).json({ message: 'Appointment confirmed successfully', appointment });
      const donorEmail = appointment.donor.email;
        await sendEmail(
            donorEmail,
            "Appointment Confirmation",
            `Dear ${appointment.donor.fullName},\n\nWe are very pleased to confirm your appointment. Soon you will be matched with the hospital where you will be destined to donate blood.\n\nBest regards,\nBlood-Link Team`
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const rejectAppointment = async (req, res) => {
    try {
      const { rejectionReason } = req.body;
      const appointment = await appointmentModel.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionReason }, { new: true }).populate('donor').populate('hospital');
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      appointment.save();
      res.status(200).json({ message: 'Appointment rejected successfully', appointment });
      const donorEmail = appointment.donor.email;
        await sendEmail(
            donorEmail,
            "Appointment Rejection",
            `Dear ${appointment.donor.fullName},\n\nWe are very sorry to inform you that your appointment has been rejected due to the following reason:\n${rejectionReason}\n\nBest regards,\nBlood-Link Team`
        );
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

  export const listConfirmedAppointments = async (req, res) => {
    try {
      const confirmedAppointments = await appointmentModel.find({ status: 'confirmed' })
      .populate('hospital')
      .populate('donor');

    // Filter out appointments without donor or hospital
    const validConfirmedAppointments = confirmedAppointments.filter(appointment => appointment.donor && appointment.hospital);

    res.status(200).json({
      numberOfConfirmedAppointments: validConfirmedAppointments.length,
      confirmedAppointments: validConfirmedAppointments
    });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const listOfappointmentsOfOneHospital = asyncWrapper(async (req, res, next) => {
  const appointments = await appointmentModel.find({ hospital: req.params.hospitalId }).populate('donor');
  if(!appointments){
    return res.status(404).json({ message: 'No appointments found for the hospital with the id inputed'});
  }
    const validAppointments = appointments.filter(appointment => appointment.donor);
  res.status(200).json({
    message:"Appointments retrieved successfully!",
    numberOfAppointments: validAppointments.length,
    appointments: validAppointments
  });
})

export const listOfappointmentsOfOneDonor = asyncWrapper(async (req, res, next) => {
  const appointments = await appointmentModel.find({ donor: req.params.donorId }).populate('hospital');
  if(!appointments){
    return res.status(404).json({ message: 'No appointments found for the donor with the id inputed'});
  }
  const validAppointments = appointments.filter(appointment => appointment.hospital);

  res.status(200).json({
    message:"Appointments retrieved successfully!",
    numberOfAppointments: validAppointments.length,
    appointments: validAppointments
  });
})
