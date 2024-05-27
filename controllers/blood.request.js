import requestModel from "../models/blood.request.model.js";
import asyncWrapper from "../middleware/async.js";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/index.js";
import hospitalModel from "../models/hospital.model.js";
import { sendEmail } from "../utils/sendEmail.js";


export const requestBlood = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }

    if (hospitalModel.status === 'Unapproved') {
        return res.status(200).json({ message: "Sorry, you cannot request blood since the hosoital is not approved." });
    }
    const { hospital: hospitalId, emergencyBloodType, quantity } = req.body
    const hospital = await hospitalModel.findById(hospitalId);

    if (hospital.status === 'Unapproved') {
        return res.status(400).json({
            message: 'This hospital is not approved to request blood.'
        });
    }

    const newBloodRequest = await requestModel.create(req.body);
    await newBloodRequest.populate('hospital');

    res.status(201).json({
        message: "Blood request created successfully",
        bloodRequest: newBloodRequest
    })
});

export const viewAllRequests = asyncWrapper(async (req, res, next) => {


    const allRequests = await requestModel.find({}).populate('hospital');

    res.status(200).json({
        message: "All requests retrieved successfully",
        numberOfRequests: allRequests.length,
        allRequests
    })
})

export const approveRequest = asyncWrapper( async (req,res,next)=>{

    const approveReq = await requestModel.findById(req.params.id).populate("hospital");
    if(!approveReq){
        return res.status(404).json({message: "Request not found"})
    }

    approveReq.status = "Pending";
    approveReq.save();


    res.status(200).json({message: "Blood request approved and hospital notified",
        approveReq
    });

    const hospitalEmail = approveReq.hospital.email;
    const subject = "Blood Link Request Approval";
    const emailBody = "Dear "+approveReq.hospital.name+",\nYour blood request has been received successfully and is being taken into consideration.\n\n You will recieve the feedback in two days!\n\n do not hesitate to contact us in case of delay!"

    await sendEmail(
        hospitalEmail,
        subject,
        emailBody
    )
});
export const searchRequests = async (req, res) => {
    try {
      const { emergencyBloodType, hospital, quantity, status } = req.query;
  
      const query = {};
  
      if (emergencyBloodType) {
        query.emergencyBloodType = emergencyBloodType;
      }
  
      if (hospital) {
        query.hospital = hospital; // This should be the ObjectId of the hospital
      }
  
      if (quantity) {
        query.quantity = quantity;
      }
  
      if (status) {
        query.status = status;
      }
  
      const requests = await requestModel.find(query).populate('hospital', 'name'); // Populating hospital name
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };