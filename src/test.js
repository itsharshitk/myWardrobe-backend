import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.js";
import { aiClothingSchema } from "./validations/aiClothing.validation.js";
import config from "./config/config.js";

const openai = new OpenAI({
  apiKey: config.openAiKey
});

const analyzeClothing = async (imageUrl) => {
    const resp = await openai.responses.parse({
        model: "gpt-4.1-mini",

        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `
                            Analyze this clothing image.

                            Identify:
                            - clothing category
                            - visible colors
                            - brand if clearly visible
                            - suitable seasons
                            - suitable occasions

                            Do not guess the brand.
                            If the brand cannot be identified, return null.
                        `,
                    },
                    {
                        type: "input_image",
                        image_url: imageUrl
                    }
                ]
            }
        ],

        text: {
            format: zodTextFormat(
                aiClothingSchema,
                "clothing_analysis"
            )
        }
    });

    return resp.output_parsed;
}

const r = await analyzeClothing("https://images.unsplash.com/photo-1779896412190-49a2fd05bd74");
console.log(r);