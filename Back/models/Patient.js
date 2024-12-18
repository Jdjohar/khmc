const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    uhid: {
        type: String,
        required: true
    },
    sno: {
        type: String,
        required: false
    },
    opdno: {
        type: String,
        required: true,
        default: '22001'
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,

    },
    status: {
        type: String,
        required: false
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

    },
    address: {
        type: String,
        required: true

    },
    city: {
        type: String,

    },
    gender: {
        type: String,
        required: true
    },
    religion: {
        type: String,

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

    },
    department: {
        type: String,
        required: false
    },
    refTo: {
        type: String,  // Referred to another department/doctor
        required: true
    },
    identStatus: {  // Identification Status
        type: String,

    },
    identity: {
        type: String,  // Identification document (e.g., Aadhar, Passport)

    },
    visitType: {
        type: String,  // E.g., first-time, follow-up, etc.
        required: false
    },
    paymentType: {
        type: String,  // E.g., Cash, Credit, Insurance
        required: false
    },
    discountType: {
        type: String,  // E.g., Senior Citizen, Corporate

    },
    discount: {
        type: Number,  // Percentage or fixed amount of discount

    },
    bed: {
        type: String,
        required: false
    },
    ward: {
        type: String,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    documents: [{
        url: {
            type: String,
            required: true
        },
        documentType: {
            type: String,  // E.g., 'prescription', 'token', etc.
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('patient', PatientSchema);
