import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { loginUser, registerUser, refreshToken, logoutUser } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { auth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
    "/register",
    upload.single("profileImage"),
    validate(registerSchema),
    asyncHandler(registerUser)
)

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(loginUser)
)

router.post(
    "/refresh",
    asyncHandler(refreshToken),
)

router.post(
    "/logout",
    auth,
    asyncHandler(logoutUser)
)

export default router;