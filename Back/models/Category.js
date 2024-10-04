const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({

    categoryname: {
        type: String,
        required: true
    },
    agelessthan: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('category', CategorySchema);