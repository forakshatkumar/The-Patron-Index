const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        businessName: { type: String, default: '', maxlength: 120 },
        industry: { type: String, default: '', maxlength: 100 },
        location: { type: String, default: '', maxlength: 120 },
        phone: { type: String, default: '', maxlength: 40 },
        bio: { type: String, default: '', maxlength: 500 },
        preferences: {
            theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
            reducedMotion: { type: Boolean, default: false },
            notifications: { type: Boolean, default: true }
        },
        name: {
            type: String,
            required: true,
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
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "analyst"],
            default: "analyst"
        },

        googleId: {
            type: String,
            default: null
        },

        avatar: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);