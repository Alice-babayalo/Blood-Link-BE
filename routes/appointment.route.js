import express from 'express';
import {
  createAppointment,
  listAppointments,
  getAppointmentById,
  confirmAppointment,
  rejectAppointment,
  updateAppointment
} from '../controllers/appointment.controller.js';
import { appointmentValidationRules} from '../utils/validation.js';
import  authMiddleware  from '../middleware/authorization.js';


const appointroute = express.Router();
// appointroute.use(authMiddleware);

appointroute.post('/createAppointment', appointmentValidationRules, createAppointment);
appointroute.get('/getAppointments', listAppointments);
appointroute.get('/getappointments/:id', getAppointmentById);
appointroute.put('/appointments/:id/confirm', confirmAppointment);
appointroute.put('/appointments/:id/reject', rejectAppointment);
appointroute.put('/updateappointment/:id', appointmentValidationRules, updateAppointment);

export default appointroute;