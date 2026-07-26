import config from './src/config/config.js';
import connectDB from './src/config/db.js';
import app from './src/app.js';
import logger from './src/config/logger.js';

const { port, mongoUri } = config;

if(!port || !mongoUri) {
    throw new Error("Config variables are not available");
}

async function start() {
    await connectDB(mongoUri);

    app.listen(port, () => {
        logger.info(`Server running on Port: ${port}`);
    })
}

start();