const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReffbySchema = new Schema({
    type: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9.'
        }
    },
    dob: {
        type: Date,
        required: true
    },
    dom: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address.'
        }
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    managedBy: {
        type: String
    },
    background: {
        type: String
    },

    investigations: [{
        investigation: {
            type: String
        },
        rate: {
            type: Number
        },
        incentiveType: {
            type: String,
            enum: ['fixed', 'percentage']
        },
        incentiveValue: {
            type: Number
        }
    }]
});

module.exports = mongoose.model('Reffby', ReffbySchema);
