import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    nodeEnv: process.env.NODE_ENV,
}

export default config;