import config from './src/config/config.js';
import connectDB from './src/config/db.js';
import app from './src/app.js';

const port = config.port || 3000;

async function start() {
    await connectDB(config.mongo_uri);

    app.listen(port, () => {
        console.log("Server running on Port: ", port);
    })
}

start();