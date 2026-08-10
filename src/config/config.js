import dotenv from 'dotenv';
dotenv.config();

const openAiKey = process.env.OPENAI_API_KEY?.trim();

// if (!openAiKey) {
//     throw new Error('OPENAI_API_KEY is missing or empty');
// }


const config = {
    port: process.env.PORT,

    mongoUri: process.env.MONGO_URI,
    
    nodeEnv: process.env.NODE_ENV,
    
    jwtRefresh: process.env.JWT_REFRESH,
    
    jwtAccess: process.env.JWT_ACCESS,
    
    cloudinaryName: process.env.CLOUDINARY_NAME,
    
    cloudinaryKey: process.env.CLOUDINARY_KEY,
    
    cloudinarySecret: process.env.CLOUDINARY_SECRET,

    openAiKey,
}

export default config;