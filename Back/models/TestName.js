const mongoose = require('mongoose');
const { Schema } = mongoose;

const TestDetailSchema = new Schema({
    Investigation: {
        type: String,
        required: false // This field is required
    },
    Result: {
        type: String,
        required: false // This field is required
    },
    Unit: {
        type: String,
        required: false // This field is required
    },
    TestComment: {
        type: String,
        required: false, // This field is required
    },
    NormalRange: {}
});

const TestNameSchema = new Schema({
    TestName: {
        type: String,
        required: true, // This field is required
    },
    Department: {
        type: String,
        required: true, // This field is required
    },
    Rate: {
        type: Number,
        required: true, // This field is required
    },
    TestCode: {
        type: String,
        required: true, // This field is required
    },
    Comment: {
        type: String,
        required: false, // This field is required
    },
    AadharCard: {
        type: Boolean,
        default: false, // Assuming Form F is a checkbox, defaults to false
    },
    Catid: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCategories', required: true },
    FormF: {
        type: Boolean,
        default: false, // Assuming Form F is a checkbox, defaults to false
    },
    testDetails: [TestDetailSchema], // New field to handle multiple test details
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('TestName', TestNameSchema);
