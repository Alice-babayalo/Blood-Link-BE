import express from 'express';
import connectDb from './db.js';
import ErrorHandlerMiddleware from '../middleware/ErrorHandler.js'
import cors from "cors"
import {routes} from '../routes/index.js'
import documentation from '../docs/swagger.json' assert {"type":"json"}
import swaggerUi from 'swagger-ui-express'
import cookieParser from "cookie-parser"
import { perfectMatch } from '../controllers/match.controller.js';
const app = express();




app.use(cors())


app.use(express.json())
app.use('/api', routes)
app.use(cookieParser());
app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(documentation))

perfectMatch();




app.listen(process.env.PORT, () => {
    connectDb();
    console.log('listening on port ' + process.env.PORT);
})
app.use(ErrorHandlerMiddleware)

export default app;
