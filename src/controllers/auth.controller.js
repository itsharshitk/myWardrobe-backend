import { register } from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = async (req, res) => {
    const user = await register(req.body);

    res.status(201).json(
        new ApiResponse(201, "User Registered Successfully", user)
    )
}