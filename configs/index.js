import exp from 'constants'
import dotenv from 'dotenv'
dotenv.config()

const config = {
    CONNECTION_STRING: process.env.MONGO_URI,
    SERVER_PORT: process.env.PORT
}

export default config;