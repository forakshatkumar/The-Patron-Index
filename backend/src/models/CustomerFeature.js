const mongoose = require("mongoose");

const customerFeatureSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            unique: true
        },

        recency: {
            type: Number,
            default: 0
        },

        frequency: {
            type: Number,
            default: 0
        },

        monetary: {
            type: Number,
            default: 0
        },

        averageOrderValue: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CustomerFeature",
    customerFeatureSchema
);