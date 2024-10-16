const mongoose = require('mongoose');
    const { Schema } = mongoose;
    
    const TestResultSchema = new Schema({
        TestlablogId: { type: mongoose.Schema.Types.ObjectId, ref: 'lablog', required: true },
        result: {
            type: String, // Each comment is a string
            default: '', // Default to an empty string if none provided
        },
    }, {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });
    
    // Export the model
    module.exports = mongoose.model('TestResult', TestResultSchema);
    