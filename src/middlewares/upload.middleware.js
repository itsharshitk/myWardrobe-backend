import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
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

const upload = multer({
    storage,
    
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    },

    fileFilter
});

export default upload;