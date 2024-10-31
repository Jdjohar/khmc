const mongoose = require('mongoose');
    const { Schema } = mongoose;
    
    const TestCatSchema = new Schema({
        categoryname: {
            type: String, // Each comment is a string
            default: '', // Default to an empty string if none provided
        },
        description: {
            type: String, // Each comment is a string
            default: '', // Default to an empty string if none provided
        },
    }, {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });
    
    // Export the model
    module.exports = mongoose.model('TestCat', TestCatSchema);
    