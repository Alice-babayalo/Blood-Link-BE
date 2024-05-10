import express from 'express';
import { SignUp, logIn, ValidateOpt, forgotPassword, resetPassword, logout } from '../controllers/Admin.controller.js';
import { signUpValidations, logInValidations, otpValidation, resetPasswordValidation, forgotPasswordValidation } from '../utils/validation.js';


export const AdminRouter = express.Router();

AdminRouter.post('/signup', signUpValidations, SignUp);
AdminRouter.post('/login', logInValidations, logIn);
AdminRouter.post('/verify', otpValidation, ValidateOpt);
AdminRouter.post('/forgotPassword', forgotPasswordValidation, forgotPassword);
AdminRouter.post('/resetPassword/:resetToken', resetPasswordValidation, resetPassword);
AdminRouter.get('/logout', logout);

