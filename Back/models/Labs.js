const mongoose = require('mongoose');
const { Schema } = mongoose;

const LabSchema = new Schema({
    labname: {
        type: String,
        required: true
    },
    labid: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('lab', LabSchema);