import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(registerUser)
)

router.post(
    "/login",
    validate(loginSchema),
    asyncHandler(loginUser)
)

export default router;