import express, { json } from 'express';
import httpLogger from './middlewares/logger.middleware.js';

const app = express();

app.use(httpLogger);

app.use(express.json());

app.get("/", (req, res) => {
    req.log.info("Home route called");

    res.send("You are on HomePage for node app");
})

export default app;