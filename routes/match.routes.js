import express from 'express';
import { matchDonorToRequest } from '../controllers/match.controller.js';
import { matchDonorValidationRules } from '../utils/validation.js';

const matchRouter = express.Router();

matchRouter.post('/admin/match-donor', matchDonorValidationRules,  matchDonorToRequest);

export default matchRouter;