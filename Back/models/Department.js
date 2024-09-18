const mongoose = require('mongoose');
const { Schema } = mongoose;

const DepartmentSchema = new Schema({

    departmentname: {
        type: String,
        required: true
    },
    usein: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    checkboxOptions: {
        type: [String], // An array of strings to store the selected options
        enum: ['Gyne', 'Infertility', 'Dental', 'Radiology', 'Eye'], // Replace with your actual checkbox option values
        default: [] // Default is an empty array, meaning no options selected initially
    }
    
})

module.exports = mongoose.model('department', DepartmentSchema);