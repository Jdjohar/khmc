const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReceiptSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },// Reference to Patient
    billNo: { type: String, required: false, unique: true }, // Unique Bill Number
    patientName: { type: String, required: true },          // Patient Name from patientData
    mobile: { type: String, required: true },               // Mobile Number from patientData
    email: { type: String, required: false },               // Optional Email from patientData                                  // Array of item objects
    total: { type: Number, required: true },                // Total amount
    received: { type: Number, required: false,},             // Received amount
    refund: { type: Number, required: true, default: 0 },   // Refund, default to 0
    discount: { type: Number, required: false },            // Discount, if any
    paymentType: { type: String, required: true },          // Payment Type (e.g., cash, card)
    visitType: { type: String, required: false },           // Visit Type (OPD, IPD, etc.)
    date: { type: Date, required: true, default: Date.now } // Date of receipt creation
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
