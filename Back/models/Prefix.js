const mongoose = require('mongoose');
const { Schema } = mongoose;

const PrefixSchema = new Schema({

    prefixname: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: false
    },
    usefor: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('prefix', PrefixSchema);