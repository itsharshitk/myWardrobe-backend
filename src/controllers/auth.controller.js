import { register } from "../services/auth.service";
import ApiResponse from "../utils/ApiResponse";

export const registerUser = async (req, res) => {
    const user = await service.register(req.body);

    res.status(201).json(
        new ApiResponse(201, "User Registered Successfully", user)
    )
}