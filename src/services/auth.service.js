import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/user.repository.js";
import tokenRepository from "../repositories/token.repository.js";
import logger from "../config/logger.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import config from "../config/config.js";
import { createHash } from "../utils/createHash.js";
import processedBuffer from "../utils/processImage.js";
import { uploadImage } from "./upload.service.js";


const userRepo = new userRepository();
const tokenRepo = new tokenRepository();

const register = async (userData, file) => {
    const userExist = await userRepo.findByEmail(userData.email);

    if(userExist) {
        throw new ApiError(409, "User already exists");
    }

    if(file) {
        const processedFile = await processedBuffer(file); // Process with sharp

        const uploadedImage = await uploadImage(processedFile);

        userData.profileImage = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
            size: uploadedImage.bytes,
            width: uploadedImage.width,
            height: uploadedImage.height
        }
        
        logger.info(`Profile Image Saved: ${userData.profileImage.url}`);
    }

    const createdUser = await userRepo.create(userData);
    
    logger.info(`User Registered: ${createdUser.email}`);

    return createdUser
}

const login = async (data) => {
    const user = await userRepo.findForLogin(data.email);
    
    if(!user){
        throw new ApiError(401, "Invalid Credentials")
    }

    const verifyPass = await user.comparePassword(data.password);

    if(!verifyPass){
        throw new ApiError(401, "Invalid Credentials");
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const token = await tokenRepo.create(user._id, refreshToken);

    if(!token){
        throw new ApiError(500, "Internal Server Error");
    }

    user.password = undefined;

    return {
        accessToken,
        refreshToken,
        user
    }
}

const refreshToken = async (token) => {
    const payload = jwt.verify(token, config.jwtRefresh);
    
    const user = await userRepo.findById(payload.id);

    if(!user){
        throw new ApiError(400, "Invalid Token");
    }

    return createAccessToken(user);
}

const logout = async (token) => {
    const tokenHash = createHash(token);

    return tokenRepo.deleteByToken(tokenHash);
}

export default {register, login, refreshToken, logout}