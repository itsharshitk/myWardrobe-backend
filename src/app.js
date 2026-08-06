import express, { json } from 'express';
import cookieParser from 'cookie-parser';

import httpLogger from './middlewares/logger.middleware.js';
import authRoutes from './routes/auth.route.js';
import clothesRoutes from './routes/clothes.route.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(httpLogger);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1", clothesRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Wardrobe");
})

app.use(errorHandler);

export default app;