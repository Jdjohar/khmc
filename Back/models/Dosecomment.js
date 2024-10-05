const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoseSchema = new Schema({

    dosecomment: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('dosecomment', DoseSchema);