import express from 'express';
import { hospitalRoute } from "./hospital.route.js";
import {userRouter} from './user.route.js';


export const routes = express.Router();

routes.use('/hospital', hospitalRoute);
routes.use('/user', userRouter)
