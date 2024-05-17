import donorModel from "../models/donor.model.js";
import { BadRequestError } from "../errors/index.js";
import { validationResult } from 'express-validator';




// Controller methods
export const createDonor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
  try {
    const { fullName, mobileNumber, nationalID, email, province, district, sector, bloodGroup, age, gender } = req.body;
    
    const donor = new donorModel({
      fullName,
      mobileNumber,
      nationalID,
      email,
      province,
      district,
      sector,
      bloodGroup,
      age,
      gender,
      weight,
      donationAvailability
    });

    await donor.save();
    res.status(201).json({ message: 'donor created successfully', donor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listDonors = async (req, res) => {
  try {
    const appointments = await donorModel.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonorById = async (req, res) => {
  try {
    const donor = await donorModel.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const updateDonor = async (req, res) => {
  try {
    const donor = await donorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor updated successfully', donor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await donorModel.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.status(200).json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
