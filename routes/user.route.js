import express from 'express';
import { SignUp, logIn, ValidateOpt, forgotPassword, resetPassword, logout } from '../controllers/user.controller.js';
import { signUpValidations, logInValidations, otpValidation, resetPasswordValidation, forgotPasswordValidation } from '../utils/validation.js';


export const userRouter = express.Router();

userRouter.post('/signup', signUpValidations, SignUp);
userRouter.post('/login', logInValidations, logIn);
userRouter.post('/verify', otpValidation, ValidateOpt);
userRouter.post('/forgotPassword', forgotPasswordValidation, forgotPassword);
userRouter.post('/resetPassword/:resetToken', resetPasswordValidation, resetPassword);
userRouter.get('/logout', logout);

