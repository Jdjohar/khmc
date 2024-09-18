const mongoose = require('mongoose');
const { Schema } = mongoose;

const PrefixSchema = new Schema({

    prefixname: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: true
    },
    usefor: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('prefix', PrefixSchema);