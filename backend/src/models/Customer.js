const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        customerId: {
            type: String,
            required: true,
            unique: true,
            trim: true
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
            trim: true
        },

        totalSpent: {
            type: Number,
            default: 0
        },

        totalOrders: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Customer", customerSchema);