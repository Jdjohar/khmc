const mongoose = require('mongoose');
const { Schema } = mongoose;

const IncentiveEntriesSchema = new Schema({

    TesttypeId: {
        type: Schema.Types.ObjectId,
        ref: 'IncentiveType',  // Referencing TestName model
        required: false
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
    servicename: {
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
    paidAmount: {
        type: String
    },
    labEntryId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('IncentiveEntrie', IncentiveEntriesSchema);