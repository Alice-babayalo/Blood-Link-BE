// routes/contactRoutes.js
import express from 'express';
import { createContactMessage, listContactMessages, deleteMessage, searchMessages } from '../controllers/contact-us.controller.js';
import { contactValidationRules } from '../utils/validation.js';


const contactRoute = express.Router();

contactRoute.post('/contact', contactValidationRules, createContactMessage);
contactRoute.get('/listMessage', listContactMessages);
contactRoute.delete('/delete/:id', deleteMessage);
contactRoute.get('/search-message',searchMessages);

export default contactRoute;
