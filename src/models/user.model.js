import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            url: String,
            publicId: String,
            size: Number,
            width: Number,
            height: Number
        },
        
        isEmailVerified: Boolean
    },
    {
        timestamps: true
    }
)

// Hash Password before saving
userSchema.pre("save", function() {
    if(!this.isModified("password")){
        return
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// function to verify password
userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}

export default mongoose.model("User", userSchema);