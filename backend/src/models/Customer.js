const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        customerId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },

        totalSpent: {
            type: Number,
            default: 0,
            index: true
        },

        totalOrders: {
            type: Number,
            default: 0
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true
        }
    },
    {
        timestamps: true
    }
);

customerSchema.index({ createdAt: -1 });
customerSchema.index({ totalSpent: -1 });

module.exports = mongoose.model("Customer", customerSchema);
