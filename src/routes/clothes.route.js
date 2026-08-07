import { Router } from "express";

import { clothesSchema } from "../validations/clothes.validation.js";
import clothesController from "../controllers/clothes.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();


router.post(
    "/clothes",
    auth,
    upload.array("clothesImage", 5),
    validate(clothesSchema),
    asyncHandler(clothesController.addClothes)
)

router.get(
    "/clothes",
    auth,
    asyncHandler(clothesController.getClothes)
)








// POST   /clothes
// GET    /clothes
// GET    /clothes/:id
// PATCH  /clothes/:id
// DELETE /clothes/:id

export default router;