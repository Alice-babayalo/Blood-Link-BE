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
    const { fullName, mobileNumber, nationalID, email, province, district, sector, bloodGroup, age, gender,weight } = req.body;
    
    const donor = new donorModel(req.body);


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
    donor.save();
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

export const searchDonors = async (req, res) => {
  try {
    const {fullName, bloodGroup, province, district, sector,age,gender,weight, availabilityDate } = req.query;

    const query = {};
    if (fullName) {
      query.fullName = { $regex: fullName, $options: 'i' };
      }

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
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
    if (age) {
      query.age = age;
    }

    if (gender) {
      query.gender = gender;
    }

    if (weight) {
      query.weight = weight;
    }

    if (availabilityDate) {
      query.donationAvailability = { $gte: new Date(availabilityDate) };
    }

    const donors = await donorModel.find(query);
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
