import OpenAI from "openai";
import config from "../config/config.js";

const openai = new OpenAI({
  apiKey: config.openAiKey,
});

export default openai;