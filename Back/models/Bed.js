const mongoose = require('mongoose');
const { Schema } = mongoose;

const BedSchema = new Schema({
    ward: {
        type: Schema.Types.ObjectId,
        ref: 'Ward', // Reference to the Ward model
        required: true
    },
    department: {
        type: String
    },
    bedname: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    gst: {
        type: Number
    },
    hsncode: {
        type: String
    },
    slotStart: {
        type: String
    },
    slotCount: {
        type: String
    },
    options: {
        inclusiveTax: {
            type: Boolean,
            default: false
        },
        otRoom: {
            type: Boolean,
            default: false
        },
        default: {
            type: Boolean,
            default: false
        },
        alwaysAvailable: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('Bed', BedSchema);
