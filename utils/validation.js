import {body, validationResult} from 'express-validator'

export const hospitalValidation = [
    body('name', 'the hospital name name is required').not().isEmpty(),
    body('email', 'email is required').not().isEmpty().isEmail(),
    body('phone', 'phone is required').not().isEmpty(),
    body('location', 'location is required').not().isEmpty()
];
export const signUpValidations = [
   
    body("username", "User name  is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Password should contain atleast 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

export const logInValidations = [
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Invalid password").isStrongPassword()
];
export const otpValidation = [
    body("otp", "Otp must be provided").not().isEmpty(),
];
export const forgotPasswordValidation = [
    body("email", "Email must be provided").not().isEmpty(),
];

export const resetPasswordValidation = [
    body("password", "Password is required").not().isEmpty(),
    body("password", "Password should contain atleast 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];
export const createAppointmentValidationRules = 
     [
      body('fullName').notEmpty().withMessage('Full name is required'),
      body('mobileNumber').matches(/^\d{10}$/).withMessage('Please enter a valid 10-digit mobile number'),
      body('nationalID').notEmpty().withMessage('National ID is required'),
      body('email').isEmail().withMessage('Please enter a valid email address'),
      body('province').notEmpty().withMessage('Province is required'),
      body('district').notEmpty().withMessage('District is required'),
      body('sector').notEmpty().withMessage('Sector is required'),
      body('bloodGroup').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
      body('age').isInt({ min: 18 }).withMessage('Minimum age should be 18 years'),
      body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    ];