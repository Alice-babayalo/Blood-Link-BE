import express from 'express';
import connectDb from './db.js';
import ErrorHandlerMiddleware from '../middleware/ErrorHandler.js'
import {routes} from '../routes/index.js'
const app = express();







app.use(express.json())
app.use('api', routes)








app.listen(process.env.PORT, () => {
    connectDb();
    console.log('listening on port ' + process.env.PORT);
})
app.use(ErrorHandlerMiddleware)

export default app;