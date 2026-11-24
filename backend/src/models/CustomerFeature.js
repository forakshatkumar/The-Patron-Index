const mongoose = require("mongoose");

const customerFeatureSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            unique: true,
            index: true
        },

        recency: {
            type: Number,
            default: 0,
            index: true
        },

        frequency: {
            type: Number,
            default: 0,
            index: true
        },

        monetary: {
            type: Number,
            default: 0,
            index: true
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
