// routes/contactRoutes.js
import express from 'express';
import { createContactMessage, listContactMessages } from '../controllers/contact-us.controller.js';
import { contactValidationRules } from '../utils/validation.js';


const contactRoute = express.Router();

contactRoute.post('/contact', contactValidationRules, createContactMessage);
contactRoute.get('/listMessage', listContactMessages);

export default contactRoute;
