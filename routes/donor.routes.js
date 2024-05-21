import express from 'express';
import {
  createDonor,
  listDonors,
  getDonorById,
 updateDonor,
 deleteDonor

  
} from '../controllers/donor.controller.js';
import {createDonorValidationRules } from '../utils/validation.js';
import { getAge } from '../utils/helperFuntion.js';
import authMiddleware from '../middleware/authorization.js';
import { get } from 'mongoose';


const router = express.Router();

// Routes
// router.use(authMiddleware);
router.post('/create',createDonorValidationRules, getAge,createDonor);
router.get('/getDonor', listDonors);
router.get('/getDonor/:id', getDonorById);

router.put('/updateDonor/:id', createDonorValidationRules, getAge, updateDonor);
router.delete('/deleteDonor/:id', deleteDonor);

export default router;
