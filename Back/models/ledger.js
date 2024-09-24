const mongoose = require('mongoose');
const { Schema } = mongoose;

const LedgerSchema = new Schema({

    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    visitDate: { type: Date, default: Date.now },
    date: {
        type: Date,
        required: true,
        default: Date.now
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
        required: true
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
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    gStatus: {
        type: String,  // Guardian status

    },
    guardianName: {
        type: String,

    },
    guardianNumber: {
        type: String,

    },
    address: {
        type: String,

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

    },
    identity: {
        type: String,  // Identification document (e.g., Aadhar, Passport)

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
})

module.exports = mongoose.model('ledger', LedgerSchema);