// controllers/adminController.js
import donorModel from '../models/donor.model.js';
import appointmentModel from '../models/appointment.model.js';
import requestModel from '../models/blood.request.model.js';
import asyncWrapper from '../middleware/async.js';
import { sendEmail } from '../utils/sendEmail.js';
import hospitalModel from '../models/hospital.model.js';


export const perfectMatch = asyncWrapper(async (req, res, next) => {
  const bloodRequests = await requestModel.find({ quantity: { $gt: 0 } }).populate('hospital');

  for (let i = 0; i < bloodRequests.length; i++) {
    const bloodRequest = bloodRequests[i];

    if (!bloodRequest.hospital) {
      console.error(`Blood request ${bloodRequest._id} has no associated hospital`);
      continue;
    }

    const donors = await donorModel.find({
      bloodGroup: bloodRequest.emergencyBloodType,
      status: 'pending'
    });

    if (donors.length === 0) {
      continue;
    }

    // Iterate through donors and find matching appointments
    let donorMatched = false;
    for (let j = 0; j < donors.length; j++) {
      const donor = donors[j];

      if (!donor) {
        console.error(`Donor ${donor._id} is null`);
        continue;
      }

      // Check if the donor has donated within the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);

      if (donor.lastDonationDate && donor.lastDonationDate > threeMonthsAgo) {
        return res.status(200).json({ message: "You arleady donated on " + donor.lastDonationDate + "\n You will be allowed to donate once more after two months from the last time you donated" });
      }

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

        if (!appointment) {
          console.error(`Appointment for donor ${donor._id} is null`);
          continue;
        }

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

        // Update donor status and last donation date
        donor.status = 'matched';
        donor.lastDonationDate = appointment.date;
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
          - Location: ${appointment.hospital.province}, ${appointment.hospital.district}, ${appointment.hospital.sector}

          Please make sure to arrive on time and bring a valid national ID.

          Thank you,
          Blood-Link Team
        `;

        await sendEmail(donor.email, emailSubject, emailBody);

        donorMatched = true;
        break;
      }
    }

    // If no matching appointments are found, match donors to their donation hospital based on location
    if (!donorMatched) {
      for (let j = 0; j < donors.length; j++) {
        const donor = donors[j];

        if (!donor) {
          console.error(`Donor ${donor._id} is null`);
          continue;
        }

        // Check if the donor has donated within the last 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);

        if (donor.lastDonationDate && donor.lastDonationDate > threeMonthsAgo) {
          return res.status(200).json({ message: "You arleady donated on " + donor.lastDonationDate + "\n You will be allowed to donate once more after two months from the last time you donated" });
        }

        // Find hospitals in the same sector as the donor
        const nearbyHospitals = await hospitalModel.find({
          sector: donor.sector,
          status: 'Approved'
        });

        for (let k = 0; k < nearbyHospitals.length; k++) {
          const hospital = nearbyHospitals[k];

          if (!hospital) {
            console.error(`Hospital ${hospital._id} is null`);
            continue;
          }

          // Check if there is an existing appointment for the donor
          const existingAppointment = await appointmentModel.findOne({
            donor: donor._id,
            hospital: hospital._id,
            status: 'pending',
            date: { $gte: new Date() }
          }).populate('hospital').populate('donor');

          const today = new Date();
          const threeDaysLater = new Date(today);
          threeDaysLater.setDate(today.getDate() + 3);

          if (!existingAppointment) {
            const newAppointment = new appointmentModel({
              donor: donor._id,
              hospital: hospital._id,
              date: threeDaysLater,
              time: '09:00 AM',
              status: 'confirmed'
            });

            await newAppointment.save();
            const populatedAppointment = await appointmentModel.findById(newAppointment._id).populate('hospital');

            // Update blood request status and decrement quantity
            bloodRequest.status = 'Matched';
            bloodRequest.quantity -= 1;
            if (bloodRequest.quantity <= 0) {
              bloodRequest.status = 'Fulfilled';
            }
            await bloodRequest.save();

            // Update donor status and last donation date
            donor.status = 'matched';
            donor.lastDonationDate = populatedAppointment.date;
            await donor.save();

            // Send email to the donor
            const emailSubject = 'Blood Donation Appointment Details';
            const emailBody = `
              Dear ${donor.fullName},

              Thank you for being a valuable donor. You have been matched to donate blood based on a request for ${bloodRequest.emergencyBloodType} blood type.

              Here are your appointment details:
              - Date: ${populatedAppointment.date.toDateString()}
              - Time: ${populatedAppointment.time}
              - Hospital: ${populatedAppointment.hospital.name}
              - Location: ${populatedAppointment.hospital.province}, ${populatedAppointment.hospital.district}, ${populatedAppointment.hospital.sector}

              Please make sure to arrive on time and bring a valid national ID.

              Thank you,
              Blood-Link Team
            `;

            await sendEmail(donor.email, emailSubject, emailBody);

            break; // Move to the next blood request after matching a donor
          }
        }

        if (bloodRequest.status === 'Fulfilled') {
          break;
        }
      }
    }
  }
  console.log('Matching process completed.');
});
