const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({

    categoryname: {
        type: String,
        required: true
    },
    agelessthan: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('category', CategorySchema);