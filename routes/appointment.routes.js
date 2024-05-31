import express from 'express';
import {
  createAppointment,
  listAppointments,
  listConfirmedAppointments ,
  getAppointmentById,
  confirmAppointment,
  rejectAppointment,
  updateAppointment,
  listOfappointmentsOfOneHospital,
  listOfappointmentsOfOneDonor
} from '../controllers/appointment.controller.js';
import { appointmentValidationRules} from '../utils/validation.js';
import { validateAppointmentDate } from '../middleware/helperFuntion.js';
import  authMiddleware  from '../middleware/authorization.js';


const appointroute = express.Router();
// appointroute.use(authMiddleware);

appointroute.post('/createAppointment', appointmentValidationRules, validateAppointmentDate, createAppointment);
appointroute.get('/getAppointments', listAppointments);
appointroute.get('/getComfirmedAppointments', listConfirmedAppointments);
appointroute.get('/getAppointmentsOfADonor/:donorId', listOfappointmentsOfOneDonor)
appointroute.get('/getAppointmentsOfAHospital/:hospitalId', listOfappointmentsOfOneHospital)
appointroute.get('/getappointments/:id', getAppointmentById);
appointroute.put('/appointments/:id/confirm', confirmAppointment);
appointroute.put('/appointments/:id/reject', rejectAppointment);
appointroute.put('/updateappointment/:id', appointmentValidationRules, validateAppointmentDate, updateAppointment);

export default appointroute;