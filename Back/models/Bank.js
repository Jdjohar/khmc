const mongoose = require('mongoose');
const { Schema } = mongoose;

const BankSchema = new Schema({

    bankname: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('bank', BankSchema);