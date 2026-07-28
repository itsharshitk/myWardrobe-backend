import mongoose from "mongoose";
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        refreshToken: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0
            }
        }
    },
    {
        timestamps: true
    }
)

refreshTokenSchema.pre("save", function(){
    if(!this.isModified("refreshToken")){
        return
    }
    this.refreshToken = crypto
    .createHash("sha256")
    .update(this.refreshToken)
    .digest("hex");
});

export default mongoose.model("RefreshToken", refreshTokenSchema);