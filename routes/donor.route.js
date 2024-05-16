import express from 'express';
import {
  createAppointment,
  listAppointments,
  getAppointmentById,
  confirmAppointment,
  rejectAppointment,
  updateAppointment
} from '../controllers/donor.controller.js';
import {createAppointmentValidationRules } from '../utils/validation.js';

const router = express.Router();

// Routes
router.post('/createAppointments',createAppointmentValidationRules, createAppointment);
router.get('/getAppointments', listAppointments);
router.get('/appointments/:id', getAppointmentById);
router.patch('/confirmAppointments/:id/confirm', confirmAppointment);
router.patch('/rejectAppointments/:id/reject', rejectAppointment);
router.put('/update/:id', updateAppointment);

export default router;
