import config from "../config/config.js";
import logger from "../config/logger.js";
import service from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = async (req, res) => {
    const user = await service.register(req.body);

    res.status(201).json(
        new ApiResponse(201, "User Registered Successfully", user)
    )
}

export const loginUser = async (req, res) => {
    const result = await service.login(req.body);

    res.cookie(
        "refreshToken",
        result.refreshToken,
        {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000
        }
    )

    res.status(200).json(
        new ApiResponse(200, "Login Successful", {user: result.user, accessToken: result.accessToken})
    )
}

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if(!token){
        res.status(404).json(
            new ApiResponse(404, "Refresh token not found")
        )
    }
    
    const access = await service.refreshToken(token);
 
    res.status(201).json(
        new ApiResponse(201, "Token Generated Successfully", {accessToken: access})
    )
}


export const logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken;
    logger.fatal(`========>>> ${token}`);
    if(!token){
        res.status(404).json(
            new ApiResponse(404, "Refresh token not found")
        )
    }

    const logout = await service.logout(token);

    res.clearCookie("refreshToken");

    res.status(200).json(
        new ApiResponse(200, "Logout Successful")
    )
}