import requestModel from "../models/blood.request.model.js";
import asyncWrapper from "../middleware/async.js";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/index.js";


export const requestBlood = asyncWrapper(async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new BadRequestError(errors.array()[0].msg));
        }

        const newBloodRequest = await requestModel.create(req.body);
        await newBloodRequest.populate('hospital');

        res.status(201).json({
            message: "Blood request created successfully",
            bloodRequest: newBloodRequest
        });
    } catch (error) {
        next(error);
    }
});

export const viewAllRequests = asyncWrapper ( async (req, res, next) =>{


    const allRequests = await requestModel.find({}).populate('hospital');

    res.status(200).json({
        message: "All requests retrieved successfully",
        numberOfRequests: allRequests.length,
        allRequests
    })
})