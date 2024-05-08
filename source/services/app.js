import express from 'express';
import connectDb from './db.js';
import ErrorHandlerMiddleware from '../middleware/ErrorHandler.js'
const app = express();
app.listen(process.env.PORT, () => {
    connectDb();
    console.log('listening on port ' + process.env.PORT);
})
app.use(ErrorHandlerMiddleware)

export default app;