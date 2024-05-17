import express from 'express';
import {
    hospitalRegister,
    deleteHospital,
    allHospitals,
    addHospital,
    login,
    updateHospitalById,
    getHospitalByDistrict,
    getHospitalByHospitalCode,
    getHospitalById, getHospitalByName,
    getHospitalByProvince,
    getHospitalByStatus,
    getHospitalBySector,
    listHospitals
} from "../controllers/hospital.controller.js";
import { hospitalValidation } from '../utils/validation.js';
import { requestBlood, viewAllRequests, approveRequest} from '../controllers/blood.request.js';


export const hospitalRoute = express.Router();

hospitalRoute.post('/register', hospitalValidation, hospitalRegister)
hospitalRoute.delete('/delete/:name', deleteHospital);
hospitalRoute.get('/list', allHospitals)
hospitalRoute.post('/add', hospitalValidation, addHospital)
hospitalRoute.post('/login', login)
hospitalRoute.put('/update', updateHospitalById)
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