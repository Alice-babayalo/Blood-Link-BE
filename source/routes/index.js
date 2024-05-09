import express from 'express';
import { hospitalRoute } from "./hospital.route.js";


export const routes = express.Router();

routes.use('hospitals', hospitalRoute);
