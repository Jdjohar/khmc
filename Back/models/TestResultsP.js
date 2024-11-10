const mongoose = require('mongoose');
    const { Schema } = mongoose;
    
    const TestResultPSchema = new Schema({
        TestlablogId: { type: mongoose.Schema.Types.ObjectId, ref: 'lablog', required: true },
        result: [],
        Catid:{
            type:String,
        },
        documents: [{
            url: {
                type: String,
                required: true
            },
            documentType: {
                type: String,  // E.g., 'prescription', 'token', etc.
                required: true
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }],
    }, {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    });
    
    // Export the model
    module.exports = mongoose.model('TestResultP', TestResultPSchema);
    