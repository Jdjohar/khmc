const mongoose = require('mongoose');
const { Schema } = mongoose;

const LabSchema = new Schema({
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'lab', required: true },
    sno:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    labReg: {
        type: Number,
        required: true
    },
    uhid: {
        type: String,
        required: false
    },
    patientName: {
        type: String,
        required: true
    },
    testType: {
        type: String,
        required: true
    },
    careofstatus: {
        type: String,
        required: false
    },
    careofName: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    agetype: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: false
    },
    aadharnumber: {
        type: String,
        required: false
    },
    reffby: {
        type: String,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    payment: {
        type: String,
        required: false
    },
    discountType: {
        type: String,
        required: false
    },
    discount: {
        type: String,
        required: false
    },
    totalamount: {
        type: String,
        required: false
    },
    result:{
        type: Boolean,
        default: false,
    },
  
    recivedamount: {
        type: String,
        required: false
    },
    dueamount: {
        type: String,
        required: false
    },
    sampledate: {
        type: Date,
        required: true,
        default: Date.now
    },
    tests: [{
        type: String,
        required: false
    }],
    documents: [{
        url: {
            type: String,
            required: false
        },
        documentType: {
            type: String,  // E.g., 'prescription', 'token', etc.
            required: false
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],

})

module.exports = mongoose.model('lablog', LabSchema);