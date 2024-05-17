import express from 'express';
import {
  createDonor,
  listDonors,
  getDonorById,
 updateDonor,
 deleteDonor

  
} from '../controllers/donor.controller.js';
import {createDonorValidationRules } from '../utils/validation.js';
import { authMiddleware } from '../middleware/authorization.js';

const router = express.Router();

// Routes
router.use(authMiddleware);
router.post('/create',createDonorValidationRules, createDonor);
router.get('/getDonor', listDonors);
router.get('/gerDonor/:id', getDonorById);

router.put('/updateDonor/:id', createDonorValidationRules,updateDonor);
router.delete('/deleteDonor/:id', deleteDonor);

export default router;
