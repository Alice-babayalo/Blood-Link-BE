import express from 'express';
import { hospitalRoute } from "./hospital.route.js";
import {AdminRouter} from './Admin.route.js';


export const routes = express.Router();

routes.use('/hospital', hospitalRoute);
routes.use('/admin', AdminRouter)
