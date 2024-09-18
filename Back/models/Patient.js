const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    uhid: {
        type: String,
        required: true
    },
    opdno: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    gStatus: {
        type: String,  // Guardian status
        required: true
    },
    guardianName: {
        type: String,
        required: true
    },
    guardianNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    agetype: {
        type: String,
        required: true
    },
    refBy: {
        type: String,  // Referred by
        required: true
    },
    type: {
        type: String,  // Type of patient (inpatient/outpatient)
        required: true
    },
    department: {
        type: String,
        required: true
    },
    refTo: {
        type: String,  // Referred to another department/doctor
        required: false
    },
    identStatus: {  // Identification Status
        type: String,
        required: false
    },
    identity: {
        type: String,  // Identification document (e.g., Aadhar, Passport)
        required: false
    },
    visitType: {
        type: String,  // E.g., first-time, follow-up, etc.
        required: true
    },
    paymentType: {
        type: String,  // E.g., Cash, Credit, Insurance
        required: true
    },
    discountType: {
        type: String,  // E.g., Senior Citizen, Corporate
        required: false
    },
    discount: {
        type: Number,  // Percentage or fixed amount of discount
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('patient', PatientSchema);
