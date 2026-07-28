import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },
        profileImage: {
            url: String,
            publicId: String,
            size: Number,
            width: Number,
            height: Number
        },
        
        isEmailVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

// Hash Password before saving
userSchema.pre("save", async function() {
    if(!this.isModified("password")){
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// function to verify password
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

export default mongoose.model("User", userSchema);