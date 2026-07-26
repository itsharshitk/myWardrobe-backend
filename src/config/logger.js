import pino from "pino";
import config from "./config.js";

const logger = pino({
    level: config.nodeEnv === "production" ? "info" : "debug",

    transport: config.nodeEnv !== "production"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                      ignore: "pid,hostname",
                  },
              }
            : undefined
});

export default logger;