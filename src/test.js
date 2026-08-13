Yes — if you're following a **service → repository → model** architecture, I'd keep MongoDB operations out of the service.

I'd structure it like this:

```text
controller
   ↓
clothing.service.js
   ↓
vision.service.js ─────→ OpenAI
   ↓
aiUsage.repository.js ─→ MongoDB
   ↓
aiUsage.model.js
```

And I'd save the **raw OpenAI usage object** as well as your normalized fields.

### 1. `models/aiUsage.model.js`

Mongoose's `Mixed` type is convenient for preserving the raw usage response without having to maintain a schema for every OpenAI usage field.

```js
import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        clothingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clothing",
            index: true
        },

        operation: {
            type: String,
            required: true,
            index: true
        },

        model: {
            type: String,
            required: true
        },

        inputTokens: {
            type: Number,
            default: 0
        },

        outputTokens: {
            type: Number,
            default: 0
        },

        totalTokens: {
            type: Number,
            default: 0
        },

        inputCost: {
            type: Number,
            default: 0
        },

        outputCost: {
            type: Number,
            default: 0
        },

        totalCost: {
            type: Number,
            default: 0
        },

        currency: {
            type: String,
            default: "USD"
        },

        // Complete usage object returned by OpenAI
        rawUsage: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("AIUsage", aiUsageSchema);
```

So MongoDB will contain something like:

```json
{
  "userId": "...",
  "clothingId": "...",
  "operation": "clothing_analysis",
  "model": "gpt-4.1-mini",

  "inputTokens": 1250,
  "outputTokens": 98,
  "totalTokens": 1348,

  "inputCost": 0.0005,
  "outputCost": 0.0001568,
  "totalCost": 0.0006568,

  "currency": "USD",

  "rawUsage": {
    "input_tokens": 1250,
    "output_tokens": 98,
    "total_tokens": 1348
  },

  "createdAt": "2026-08-13T04:00:00.000Z",
  "updatedAt": "2026-08-13T04:00:00.000Z"
}
```

If OpenAI gives you additional usage fields in the future, `rawUsage` preserves them.

---

## 2. `repositories/aiUsage.repository.js`

The repository should handle the actual `create()`.

```js
import AIUsage from "../models/aiUsage.model.js";

const create = async (usageData) => {
    return AIUsage.create(usageData);
};

export default {
    create
};
```

You can later add:

```js
const findByUserId = async (userId) => {
    return AIUsage.find({ userId })
        .sort({ createdAt: -1 });
};

const getTotalCostByUser = async (userId) => {
    const [result] = await AIUsage.aggregate([
        {
            $match: {
                userId
            }
        },
        {
            $group: {
                _id: null,
                totalCost: {
                    $sum: "$totalCost"
                },
                totalTokens: {
                    $sum: "$totalTokens"
                },
                requests: {
                    $sum: 1
                }
            }
        }
    ]);

    return result || {
        totalCost: 0,
        totalTokens: 0,
        requests: 0
    };
};

export default {
    create,
    findByUserId,
    getTotalCostByUser
};
```

I'd actually use this second version from the beginning.

---

## 3. `vision.service.js`

Here, don't touch MongoDB at all.

Just return the analysis and usage.

```js
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
                        `
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

    const usage = resp.usage;

    const inputTokens = usage?.input_tokens ?? 0;
    const outputTokens = usage?.output_tokens ?? 0;
    const totalTokens = usage?.total_tokens ?? 0;

    const inputCost =
        (inputTokens / 1_000_000) * 0.40;

    const outputCost =
        (outputTokens / 1_000_000) * 1.60;

    return {
        data: resp.output_parsed,

        usage: {
            operation: "clothing_analysis",
            model: "gpt-4.1-mini",

            inputTokens,
            outputTokens,
            totalTokens,

            inputCost,
            outputCost,
            totalCost: inputCost + outputCost,

            currency: "USD",

            // Save exactly what OpenAI returned
            rawUsage: usage
        }
    };
};
```

---

## 4. `clothing.service.js`

Now your service coordinates everything.

```js
import visionService from "./vision.service.js";
import aiUsageRepository from "../repositories/aiUsage.repository.js";
import clothingRepository from "../repositories/clothing.repository.js";

const analyzeClothing = async (fileBuffer, userId) => {
    let uploadedImg;

    try {
        const processedBuff = await processBuffer(fileBuffer);

        uploadedImg = await uploadImage(processedBuff);

        // 1. Analyze using OpenAI
        const analyzedData = await visionService.analyzeClothing(
            uploadedImg.secure_url
        );

        // 2. Create clothing using repository
        const clothing = await clothingRepository.create({
            userId,
            imageUrl: uploadedImg.secure_url,
            publicId: uploadedImg.public_id,

            category: analyzedData.data.category,
            colors: analyzedData.data.colors,
            brand: analyzedData.data.brand,
            seasons: analyzedData.data.seasons,
            occasions: analyzedData.data.occasions
        });

        // 3. Save OpenAI usage using repository
        await aiUsageRepository.create({
            userId,
            clothingId: clothing._id,

            operation: analyzedData.usage.operation,
            model: analyzedData.usage.model,

            inputTokens: analyzedData.usage.inputTokens,
            outputTokens: analyzedData.usage.outputTokens,
            totalTokens: analyzedData.usage.totalTokens,

            inputCost: analyzedData.usage.inputCost,
            outputCost: analyzedData.usage.outputCost,
            totalCost: analyzedData.usage.totalCost,

            currency: analyzedData.usage.currency,

            rawUsage: analyzedData.usage.rawUsage
        });

        return {
            imageUrl: uploadedImg.secure_url,
            publicId: uploadedImg.public_id,
            clothingId: clothing._id,
            data: analyzedData.data
        };

    } catch (error) {
        if (uploadedImg?.public_id) {
            try {
                await deleteImage(uploadedImg.public_id);
            } catch (cleanupError) {
                logger.error(cleanupError);
            }
        }

        throw error;
    }
};
```

### 5. One improvement I'd make

Since you're already using repositories, I wouldn't have `clothing.service.js` know all the individual fields of `AIUsage`.

Instead, make the repository accept the usage object:

```js
const createFromAnalysis = async ({
    userId,
    clothingId,
    usage
}) => {
    return AIUsage.create({
        userId,
        clothingId,

        operation: usage.operation,
        model: usage.model,

        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,

        inputCost: usage.inputCost,
        outputCost: usage.outputCost,
        totalCost: usage.totalCost,

        currency: usage.currency,

        rawUsage: usage.rawUsage
    });
};
```

Then your service becomes cleaner:

```js
await aiUsageRepository.createFromAnalysis({
    userId,
    clothingId: clothing._id,
    usage: analyzedData.usage
});
```

That's the separation I'd recommend:

```text
vision.service.js
    ↓
    OpenAI API
    ↓
    { data, usage }


clothing.service.js
    ↓
    orchestrates the workflow


aiUsage.repository.js
    ↓
    transforms usage → MongoDB document
    ↓
    AIUsage.create()


aiUsage.model.js
    ↓
    MongoDB schema
```

**One caveat:** I would store `rawUsage` as the SDK's usage object, but if you later discover that the OpenAI SDK returns a class/object with non-plain properties, convert it to a plain JSON-compatible object before saving (e.g. `structuredClone(usage)` or an equivalent serialization step). This avoids surprises with Mongoose's `Mixed` field.
