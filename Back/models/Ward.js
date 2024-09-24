const mongoose = require('mongoose');
const { Schema } = mongoose;

const WardSchema = new Schema({

    wardname: {
        type: String,
        required: true
    },
    floorno: {
        type: String
    },
})

module.exports = mongoose.model('ward', WardSchema);