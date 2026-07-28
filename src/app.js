import express, { json } from 'express';
import httpLogger from './middlewares/logger.middleware.js';
import authRoutes from './routes/auth.route.js';
import errorHandler from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(httpLogger);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
    req.log.info("Home route called");

    res.send("You are on HomePage for node app");
})

app.use(errorHandler);

export default app;