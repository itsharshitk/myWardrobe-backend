import config from "../config/config.js";
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