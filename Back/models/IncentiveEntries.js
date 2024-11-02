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
    testid: {
        type: String
    },
    amount: {
        type: String
    },
})

module.exports = mongoose.model('IncentiveEntrie', IncentiveEntriesSchema);