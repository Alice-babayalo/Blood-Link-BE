import express from 'express';
import { 
    hospitalRegister, 
    deleteHospital, 
    allHospitals, 
    addHospital, 
    login, 
    getHospitalByStatus,
    getHospitalByDistrict,
    getHospitalByProvince, 
    getHospitalBySector, 
    getHospitalByHospitalCode, 
    getHospitalByName, 
    getHospitalById,
    updateHospitalById
} from "../controllers/hospital.controller.js";
import { hospitalValidation } from '../validation/hospital.validation.js';


export const hospitalRoute = express.Router();

hospitalRoute.post('/register', hospitalValidation, hospitalRegister)
hospitalRoute.delete('/delete/:id', deleteHospital);
hospitalRoute.get('/list', allHospitals)
hospitalRoute.post('/add', addHospital)
hospitalRoute.post('/login',login)
hospitalRoute.put('/update', )
hospitalRoute.get('/getHospitalsByStatus/:status', getHospitalByStatus)
hospitalRoute.get('/getHospitalsByProvince/:province', getHospitalByProvince)
hospitalRoute.get('/getHospitalsByDistrict/:district', getHospitalByDistrict)
hospitalRoute.get('/getHospitalByName/:name', getHospitalByName)
hospitalRoute.get('/getHospitalByHospitalCode/:hospitalCode', getHospitalByHospitalCode)
hospitalRoute.get('/getHospitalBySector/:sector', getHospitalBySector)
hospitalRoute.get('/getHospitalById/:id', getHospitalById)