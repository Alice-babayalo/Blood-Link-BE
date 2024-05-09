import express from 'express';
import { hospitalRegister } from "../controllers/hospital.controller.js";
import { hospitalValidation } from '../utils/validation.js';


export const hospitalRoute = express.Router();

hospitalRoute.post('/register', hospitalValidation, hospitalRegister)

