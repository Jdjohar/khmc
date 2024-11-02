const mongoose = require('mongoose');
const { Schema } = mongoose;

const IncentiveTypeSchema = new Schema({
    typeName: {
        type: String,
        required: true
    },
    typeTests: [{
        TestId: {
            type: Schema.Types.ObjectId,
            ref: 'TestName',  // Referencing TestName model
            required: true
        },
        TestIncentiveValueType: {
            type: String,
            required: true
        },
        TestIncentiveValue: {
            type: Number,
            required: true
        },
        TestPrice: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('IncentiveType', IncentiveTypeSchema);
