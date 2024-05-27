import express from 'express';
import {
  createDonor,
  listDonors,
  getDonorById,
 updateDonor,
 deleteDonor,
 searchDonors,
listOfMatchedDonors

  
} from '../controllers/donor.controller.js';
import {createDonorValidationRules } from '../utils/validation.js';
import { getAge } from '../middleware/helperFuntion.js';
import { perfectMatch } from '../controllers/match.controller.js';
import authMiddleware from '../middleware/authorization.js';


const router = express.Router();

// Routes
//router.use(authMiddleware);
router.post('/create',createDonorValidationRules, getAge,createDonor);
router.get('/getDonor', listDonors);
router.get('/getDonor/:id', getDonorById);

router.put('/updateDonor/:id', createDonorValidationRules, getAge, updateDonor);
router.delete('/deleteDonor/:id', deleteDonor);

router.get('/search-donor',searchDonors);

router.get('/matchedDonors', perfectMatch, listOfMatchedDonors)


export default router;
