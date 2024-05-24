import express from 'express';
import {  perfectMatch } from '../controllers/match.controller.js';
import { matchDonorValidationRules } from '../utils/validation.js';

const matchRouter = express.Router();

matchRouter.get('/match-donor', perfectMatch);

export default matchRouter;