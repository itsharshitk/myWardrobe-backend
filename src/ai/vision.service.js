import openai from "./openai.js";

export const analyzeClothing = async (imageUrl) => {
    const resp = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: "Analyze this clothing item."
                    },
                    {
                        type: "input_image",
                        image_url: imageUrl
                    }
                ]
            }
        ]
    });

    return resp.output_text;
}