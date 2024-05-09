import hospitalModel from "../models/hospital.model.js";
import asyncWrapper from '../middleware/async.js';
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';
import {sendEmail} from "../middleware/sendEmail.js"


export const hospitalRegister = asyncWrapper ( async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const existingHospital = await hospitalModel.findOne({ hospitalName: req.body.hospitalName });
    if (existingHospital) {
        return res.status(200).json({ message: "hospital already exists" });
    }
    const newHospital = await hospitalModel.create(req.body);
    
    await sendEmail(
        req.body.email,
        "Hospital Registration Request",
        "Your request for hospital registration at RBC for Blood Link services in the names of "+req.body.name+"has been received! RBC will send you an approval email within 24 hours!",
    );
    await sendEmail(
        process.env.USER_EMAIL,
        "Hospital Registration Request",
        "The hospital in the names of "+req.body.name+"is requesting an approval for Blood Link services. Please consider their registration request"
    );

    return res.status(201).json({
        message: "Hospital Registration Requested Successfully",
        user: newHospital
    });
})