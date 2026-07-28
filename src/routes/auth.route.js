import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { registerSchema } from "../validations/auth.validation";
import { registerUser } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(registerUser)
)

export default router;