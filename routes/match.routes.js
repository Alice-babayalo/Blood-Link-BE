import express from 'express';
import { matchDonorsToRequest } from '../controllers/match.controller.js';
import { matchDonorValidationRules } from '../utils/validation.js';

const matchRouter = express.Router();

matchRouter.post('/match-donor', matchDonorValidationRules,  matchDonorsToRequest);

export default matchRouter;