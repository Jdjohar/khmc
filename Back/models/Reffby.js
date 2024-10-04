const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReffbySchema = new Schema({
    type: {
        type: String,
        
    },
    doctorName: {
        type: String,
        
    },
    department: {
        type: String,
        
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    address: {
        type: String,
        
    },
    city: {
        type: String,
       
    },
    mobileNumber: {
        type: String,
        
        // validate: {
        //     validator: function(v) {
        //         return /^[6-9]\d{9}$/.test(v);
        //     },
        //     message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9.'
        // }
    },
    dob: {
        type: Date,
       
    },
    dom: {
        type: Date
    },
    email: {
        type: String,
    
        // validate: {
        //     validator: function(v) {
        //         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        //     },
        //     message: 'Please enter a valid email address.'
        // }
    },
    accountNumber: {
        type: String,
      
    },
    ifscCode: {
        type: String,
     
    },
    bankName: {
        type: String,
       
    },
    branch: {
        type: String,
        
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
