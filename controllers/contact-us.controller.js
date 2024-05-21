import contactModel from "../models/contact-us.model.js";
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from 'dotenv'
dotenv.config

export const createContactMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }
    
    try {
      const { fullName, email, message } = req.body;
  
      const contactMessage = new contactModel({
        fullName,
        email,
        message
      });

      const subject = "New user message";
      await sendEmail(
        process.env.EMAIL_USER,
        subject,
        "You have a new message from "+fullName+", with the email address of "+email+". The message states: \n"+req.body.message
      )
  
      await contactMessage.save();
      res.status(201).json({ message: 'Contact message submitted successfully', contactMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const listContactMessages = async (req, res) => {
    try {
      const contactMessages = await contactModel.find();
      res.status(200).json(contactMessages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
