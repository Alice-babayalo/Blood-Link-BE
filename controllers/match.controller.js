// controllers/adminController.js
import donorModel from '../models/donor.model.js';
import appointmentModel from '../models/appointment.model.js';
import requestModel from '../models/blood.request.model.js';
import asyncWrapper from '../middleware/async.js';
import { sendEmail } from '../utils/sendEmail.js';

export const perfectMatch = asyncWrapper(async (req, res, next) => {
  const bloodRequests = await requestModel.find({ status: 'Sent' }).populate('hospital');
  
  for (let i = 0; i < bloodRequests.length; i++) {
    const bloodRequest = bloodRequests[i];
    console.log(bloodRequests + "\n================================\n");

    const donors = await donorModel.find({
      bloodGroup: bloodRequest.emergencyBloodType,
      status: 'pending'
    });
    console.log(donors + '------------------------------------------------------------------------------------------------------------------------');

    if (donors.length === 0) {
      continue;
    }

    // Iterate through donors and find matching appointments
    for (let j = 0; j < donors.length; j++) {
      const donor = donors[j];
      const appointments = await appointmentModel.find({
        donor: donor._id,
        hospital: bloodRequest.hospital._id,
        status: 'pending',
        date: { $gte: new Date() }
      }).populate('hospital').populate('donor');

      if (appointments.length > 0) {
        // Prioritize appointments based on the earliest date
        const sortedAppointments = appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
        const appointment = sortedAppointments[0];

        // Update appointment status to 'confirmed'
        appointment.status = 'confirmed';
        await appointment.save();

        // Update blood request status and decrement quantity
        bloodRequest.status = 'Matched';
        bloodRequest.quantity -= 1;
        if (bloodRequest.quantity <= 0) {
          bloodRequest.status = 'Fulfilled';
        }
        await bloodRequest.save();

        // Update donor status
        donor.status = 'Matched';
        await donor.save();

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
          Blood-Link Team
        `;

        await sendEmail(donor.email, emailSubject, emailBody);

        // Continue to the next blood request after matching a donor
        break;
      }
    }
  }

  // res.status(200).json({ message: 'Blood request processing completed.' });
  next();
});