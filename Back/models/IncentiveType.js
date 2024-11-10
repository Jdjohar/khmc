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
        TestIncentiveValueType: { //amount or percetage
            type: String,
            required: true
        },
        TestIncentiveValue: { //some value enter by admin on
            type: Number,
            required: true
        },
        IncentivePercentageValue: { //percentage value
            type: Number,
            required: false
        },
        TestPrice: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('IncentiveType', IncentiveTypeSchema);
