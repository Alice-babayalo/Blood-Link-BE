import express from 'express';
import { hospitalRoute } from "./hospital.route.js";
import {userRouter} from './user.route.js';
import router from './donor.route.js';
import appointroute from './appointment.route.js';
import contactRoute from './contact-us.route.js';


export const routes = express.Router();

routes.use('/hospital', hospitalRoute);
routes.use('/user', userRouter);
routes.use('/donor',router)
routes.use("/appointment",appointroute);
routes.use("/contact-us",contactRoute);

