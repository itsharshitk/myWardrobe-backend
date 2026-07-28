import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { registerSchema } from "../validations/auth.validation.js";
import { registerUser } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/test", (req, res) => {
    res.send("Hello");
})

router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(registerUser)
)

export default router;