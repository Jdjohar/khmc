const mongoose = require('mongoose');
const { Schema } = mongoose;

const PcomSchema = new Schema({

    complaintsname: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: false
    },
    group: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('pcom', PcomSchema);