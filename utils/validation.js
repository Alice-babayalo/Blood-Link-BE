import {body, validationResult} from 'express-validator'

export const hospitalValidation = [
    body('name', 'the hospital name name is required').not().isEmpty(),
    body('email', 'email is required').not().isEmpty().isEmail(),
    body('phone', 'phone is required').not().isEmpty(),
    body('province', 'location is required').not().isEmpty(),
    body('sector', 'location is required').not().isEmpty(),
    body('district', 'location is required').not().isEmpty()
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