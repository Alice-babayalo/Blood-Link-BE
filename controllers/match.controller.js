// controllers/adminController.js
import donorModel from '../models/donor.model.js';
import appointmentModel from '../models/appointment.model.js';
import requestModel from '../models/blood.request.model.js';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../errors/index.js';
import asyncWrapper from '../middleware/async.js';
import { sendEmail } from '../utils/sendEmail.js';


/*
export const searchAvailableDonors = asyncWrapper (async (req, res, next) => {
  const { bloodGroup, location, date } = req.query;
    
    const donors = await Donor.find({
      bloodGroup,
      location,
      donationAvailability: { $gte: new Date(date) }
    });

    res.status(200).json(donors);
});


export const matchDonorToRequest = async (req, res) => {
  const { donorId, requestId } = req.body;

  try {
    const donor = await Donor.findById(donorId);
    const request = await HospitalRequest.findById(requestId).populate('hospital');

    if (!donor || !request) {
      return res.status(404).json({ message: 'Donor or Request not found' });
    }

    const appointment = new Appointment({
      donor: donorId,
      hospital: request.hospital._id,
      date: donor.donationAvailability,
      time: '09:00', // default time
      status: 'confirmed'
    });

    await appointment.save();

    request.status = 'fulfilled';
    await request.save();

    res.status(201).json({ message: 'Donor matched and appointment confirmed', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

*/
export const matchDonorToRequest = asyncWrapper(async (req, res, next) => {
  const { requestId, donorId, appointmentId } = req.body;

  // Find the blood request
  const bloodRequest = await requestModel.findById(requestId).populate('hospital');
  if (!bloodRequest) {
      return next(new BadRequestError('Blood request not found'));
  }

  // Find the donor
  const donor = await donorModel.findById(donorId);
  if (!donor) {
      return next(new BadRequestError('Donor not found'));
  }

  // Find the appointment
  const appointment = await appointmentModel.findById(appointmentId).populate('hospital');
  if (!appointment) {
      return next(new BadRequestError('Appointment not found'));
  }

  // Check if the appointment date is in the future
  const currentDate = new Date();
  const appointmentDate = new Date(appointment.date);

  if (appointmentDate < currentDate) {
      return next(new BadRequestError('The appointment date cannot be in the past'));
  }

  // Update the blood request status to 'Matched'
  bloodRequest.status = 'Matched';
  appointment.status = 'confirmed'
  await bloodRequest.save();

  // Send email to the donor
  const emailSubject = 'Blood Donation Appointment Details';
  const emailBody = `
      Dear ${donor.fullName},

      Thank you for being a valuable donor. You have been matched to donate blood based on a request for ${bloodRequest.emergencyBloodType} blood type.

      Here are your appointment details:
      - Date: ${appointment.date}
      - Time: ${appointment.time}
      - Hospital: ${appointment.hospital.name}

      Please make sure to arrive on time and bring a valid ID.

      Thank you,
      Blood Donation Team
  `;

  await sendEmail(donor.email, emailSubject, emailBody);

  res.status(200).json({ message: 'Donor matched with appointment and email sent successfully' });


});