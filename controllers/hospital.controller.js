import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import hospitalModel from "../models/hospital.model.js";
import asyncWrapper from '../middleware/async.js';
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';
import { sendEmail } from '../utils/sendEmail.js';
import { otpGenerator } from '../utils/otp.js';
import userModel from '../models/user.model.js';


export const hospitalRegister = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    const existingHospital = await hospitalModel.findOne({ email: req.params.email });
    if (existingHospital) {
        return res.status(200).json({ message: "hospital already exists" });
    }
    const newHospital = await hospitalModel.create(req.body);

    await sendEmail(
        req.body.email,
        "Hospital Registration Request",
        "Your request for hospital registration at RBC for Blood Link services in the names of " + req.body.name + " has been received! RBC will send you an approval email within 24 hours!",
    );
    await sendEmail(
        "linkblood33@gmail.com",
        "Hospital Registration Request",
        "The hospital in the names of " + req.body.name + "is requesting an approval for Blood Link services. Please consider their registration request"
    );

    return res.status(201).json({
        message: "Hospital Registration Requested Successfully",
        user: newHospital
    });
})

export const getHospital = asyncWrapper( async(req, res, next) => {
    const hospitalId = req.params.id;
    const hospital = await hospitalModel.findById(hospitalId);
    if(!hospital){
        return res.status(404).json({
            message: "Hospital Not Found"
        });
    }
    res.status(200).json({
        message: "Hospital found successfully!",
        check: hospital
    })
})

export const deleteHospital = asyncWrapper(async (req, res, next) => {
    const hospital = await hospitalModel.findByIdAndDelete(req.params.id)
    if (!hospital) {
        res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json({ message: "Hospital deleted successfully!" });
});


export const allHospitals = asyncWrapper(async (req, res, next) => {
    const allHospitals = await hospitalModel.find({});
    res.status(200).json({
        number_of_hospitals: allHospitals.length,
        all_hospitals: allHospitals
    })
});

export const addHospital = asyncWrapper(async (req, res, next) => {
    const { name, hospitalCode, email, phone, province, district, sector } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }


    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@!$*0123456789';
    let password = ''
    let length = 8;
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const hashedPassword = await bcryptjs.hash(password, 15);

    const newHospital = new hospitalModel(req.body);
    newHospital.password = hashedPassword;
    newHospital.status = 'Approved';
    await newHospital.save();

    const newUser = new userModel({
        username: name,
        email,
        password: hashedPassword,
        role: 'hospital',
        verified: true,
        otp: otpGenerator()
    });

    await newUser.save();

    await sendEmail(
        email,
        "Welcome to Blood Link System",
        "Dear " + req.body.name + ", your approval request has been approved! You are now allowed to log in through blood Link for more hospitality services.\nPlease use these credentials to log in:\nEmail: " + email + "\nPassword: " + password + "\n"
    );

    res.status(200).json({ message: 'Hospital added successfully. Login credentials sent to your email.',
        newHospital
     });
});


export const getHospitalByStatus = asyncWrapper(async (req, res, next) => {

    const hospital = await hospitalModel.find({status: req.params.status})

    res.status(200).json({ 
        message: 'Hospital information retrieved successfully!',
        number_of_hospitals: hospital.length,
        hospitals: hospital
    });
});

export const updateHospitalById = asyncWrapper(async (req, res, next) => {

    const hospital = await hospitalModel.findByIdAndUpdate({id: req.params.id}, req.body, {new: true});

    res.status(200).json({
        message: "Hospital information updated successfully",
        hospital
    });

});


export const getHospitalByDistrict = asyncWrapper(async (req, res, next) => {
    const hospital = hospitalModel.find({district: req.params.district})

    res.status(200).json({
        message: 'Hospital information retrieved successfully!',
        number_of_hospitals: hospital.length,
        hospitals: hospital
    })
});


export const getHospitalByProvince = asyncWrapper(async (req, res, next) => {
    const hospital = hospitalModel.find({province: req.params.province})

    res.status(200).json({
        message: 'Hospital information retrieved successfully!',
        number_of_hospitals: hospital.length,
        hospitals: hospital
    })
});

export const getHospitalBySector = asyncWrapper(async (req, res, next) => {
    const hospital = hospitalModel.find({sector: req.params.sector})

    res.status(200).json({
        message: 'Hospital information retrieved successfully!',
        number_of_hospitals: hospital.length,
        hospitals: hospital
    })
});


export const getHospitalByName = asyncWrapper(async (req, res, next) => {
    const hospital = hospitalModel.find({name: req.params.name})

    res.status(200).json({
        message: 'Hospital information retrieved successfully!',
        number_of_hospitals: hospital.length,
        hospitals: hospital
    })
});


export const getHospitalByHospitalCode = asyncWrapper(async (req, res, next) => {
    const hospital = hospitalModel.find({hospitalCode: req.params.hospitalCode})

    res.status(200).json({
        message: 'Hospital information retrieved successfully!',
        number_of_hospitals: hospital.length,
        hospitals: hospital
    })
});


export const getHospitalById = asyncWrapper(async (req, res, next) => {
    const hospital = hospitalModel.findById(req.params.id);

    res.status(200).json({
        message: 'Hospital information retrieved successfully!',
        hospitals: hospital
    })
});
export const listHospitals = asyncWrapper(async (req, res, next) => {

    const hospitals = await hospitalModel.find({}, 'name');
    res.status(200).json({message:"A list of all hospitals is retrieved successfully" ,hospitals});
});




export const searchHospitals = async (req, res) => {
  try {
    const { name, email, phone, hospitalCode, province, district, sector, status, role } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' }; // Case-insensitive search
    }

    if (phone) {
      query.phone = phone;
    }

    if (hospitalCode) {
      query.hospitalCode = hospitalCode;
    }

    if (province) {
      query.province = province;
    }

    if (district) {
      query.district = district;
    }

    if (sector) {
      query.sector = sector;
    }

    if (status) {
      query.status = status;
    }

    if (role) {
      query.role = role;
    }

    const hospitals = await hospitalModel.find(query);
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
