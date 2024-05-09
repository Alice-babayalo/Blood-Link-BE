import exp from 'constants'
import dotenv from 'dotenv'
dotenv.config()

const config = {
    CONNECTION_STRING: process.env.MONGO_URI,
    SERVER_PORT: process.env.PORT,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY

}

export default config;