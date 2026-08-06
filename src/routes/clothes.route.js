import { Router } from "express";

import { clothesSchema } from "../validations/auth.validation.js";
import clothesController from "../controllers/clothes.controller.js";
import clothesModel from "../models/clothes.model.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = new Router();


router.post(
    "/clothes",
    auth,
    validate(clothesSchema),
    asyncHandler(clothesController.addClothes)
)










// POST   /clothes
// GET    /clothes
// GET    /clothes/:id
// PATCH  /clothes/:id
// DELETE /clothes/:id