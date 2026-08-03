import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },

    fileFilter(req, file, cb) {
        const allowedTypes = [
            "image/webp",
            "image/jpeg",
            "image/png"
        ];

        if(allowedTypes.includes(file.mimetype)){
            return cb(null, true)
        } else {
            return cb(new Error("Only jpeg, png and webp images allowed"))
        }

    }
})

export default upload;