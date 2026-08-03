import sharp from "sharp";

const processedBuffer = async (buffer) => {
    return await sharp(buffer)
        .resize(500, 500, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .jpeg({
            quality: 80
        })
        .toBuffer();
}

export default processedBuffer;