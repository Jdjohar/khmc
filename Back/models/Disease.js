const mongoose = require('mongoose');
const { Schema } = mongoose;

const DiseaseSchema = new Schema({

    diseasename: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('disease', DiseaseSchema);