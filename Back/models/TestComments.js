const mongoose = require('mongoose');
    const { Schema } = mongoose;
    
    const TestNameSchema = new Schema({
        TestId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestName', required: true },
        Comments: {
            type: String, // Each comment is a string
            default: '', // Default to an empty string if none provided
        },
    }, {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });
    
    // Export the model
    module.exports = mongoose.model('TestComment', TestNameSchema);
    