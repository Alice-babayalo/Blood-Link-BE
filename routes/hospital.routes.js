import express from 'express';
import {
    hospitalRegister,
    deleteHospital,
    allHospitals,
    addHospital,
    updateHospitalById,
    getHospitalByDistrict,
    getHospitalByHospitalCode,
    getHospitalById, getHospitalByName,
    getHospitalByProvince,
    getHospitalByStatus,
    getHospitalBySector,
    listHospitals,
    searchHospitals
} from "../controllers/hospital.controller.js";
import { hospitalValidation } from '../utils/validation.js';
import { requestBlood, viewAllRequests,approveRequest, searchRequests } from '../controllers/blood.request.js';
import authMiddleware from '../middleware/authorization.js'

export const hospitalRoute = express.Router();
// hospitalRoute.use(authMiddleware);

// hospitalRoute.post('/register', hospitalValidation, hospitalRegister)
hospitalRoute.delete('/delete/:id', deleteHospital);
hospitalRoute.get('/list', allHospitals)
hospitalRoute.post('/add', hospitalValidation, addHospital)
hospitalRoute.put('/update', hospitalValidation, updateHospitalById)
hospitalRoute.get('/getHospitalsByStatus/:status', getHospitalByStatus)
hospitalRoute.get('/getHospitalsByProvince/:province', getHospitalByProvince)
hospitalRoute.get('/getHospitalsByDistrict/:district', getHospitalByDistrict)
hospitalRoute.get('/getHospitalByName/:name', getHospitalByName)
hospitalRoute.get('/getHospitalByHospitalCode/:hospitalCode', getHospitalByHospitalCode)
hospitalRoute.get('/getHospitalBySector/:sector', getHospitalBySector)
hospitalRoute.get('/getHospitalById/:id', getHospitalById)
hospitalRoute.post('/bloodRequest', requestBlood)
hospitalRoute.get('/listOfBloodRequest', viewAllRequests)
hospitalRoute.get('/approveRequest/:id', approveRequest)
hospitalRoute.get('/namesOfAllHospitals', listHospitals)
hospitalRoute.get('/search-hospital',searchHospitals)
hospitalRoute.get('/search-bloodRequest',searchRequests)