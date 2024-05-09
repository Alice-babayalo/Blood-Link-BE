import {body, validationResult} from 'express-validator'

export const hospitalValidation = [
    body('name', 'the hospital name name is required').not().isEmpty(),
    body('email', 'email is required').not().isEmpty().isEmail(),
    body('phone', 'phone is required').not().isEmpty(),
    body('location', 'location is required').not().isEmpty()
]