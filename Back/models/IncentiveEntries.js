const mongoose = require('mongoose');
const { Schema } = mongoose;

const IncentiveEntriesSchema = new Schema({

    TesttypeId: {
        type: Schema.Types.ObjectId,
        ref: 'IncentiveType',  // Referencing TestName model
        required: true
    },
    Reffby: {
        type: String
    },
    Reffto: {
        type: String
    },
    testid: {
        type: String
    },
    amount: {
        type: String
    },
    patientName: {
        type: String
    },
    date: {
        type: String
    },
    regno: {
        type: String
    },
    discount: {
        type: String
    },
    receiveAmt: {
        type: String
    },
    due: {
        type: String
    },
    incStatus: {
        type: Boolean
    },
    incAmount: {
        type: String
    },
})

module.exports = mongoose.model('IncentiveEntrie', IncentiveEntriesSchema);