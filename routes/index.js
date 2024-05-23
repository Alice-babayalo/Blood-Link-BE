import express from 'express';
import { hospitalRoute } from "./hospital.routes.js";
import {userRouter} from './user.routes.js';
import router from './donor.routes.js';
import appointroute from './appointment.routes.js';
import contactRoute from './contact-us.routes.js';
import matchRouter from './match.routes.js';


export const routes = express.Router();

routes.use('/hospital', hospitalRoute);
routes.use('/user', userRouter);
routes.use('/donor',router)
routes.use("/appointment",appointroute);
routes.use("/contact-us",contactRoute);
routes.use('/admin', matchRouter)

