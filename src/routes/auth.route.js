import { Router } from "express";
import { loginSchema, passwordSchema, registerSchema } from "../validations/auth.validation.js";
import { loginUser, registerUser, refreshToken, logoutUser, resetPassword } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
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
    "/reset-password",
    auth,
    validate(passwordSchema),
    asyncHandler(resetPassword)
)

router.post(
    "/logout",
    auth,
    asyncHandler(logoutUser)
)

export default router;