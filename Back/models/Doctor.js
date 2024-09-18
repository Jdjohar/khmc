const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoctorSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    doctorname: {
        type: String,
        required: true
    },
    doctordepartment: {
        type: String,
        required: true
    },
    doctorstatus: {
        type: String,
        required: true
    },
    doctoraddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10,15}$/.test(v); // Ensures a mobile number is 10-15 digits long
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    dob: {
        type: Date, // Use Date type for birthdate
        required: true
    },
    dom: {
        type: Date, // Use Date type for date of membership
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    accountnumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{9,18}$/.test(v); // Ensures account number is 9-18 digits
            },
            message: props => `${props.value} is not a valid account number!`
        }
    },
    ifsccode: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // Simple IFSC code validation
            },
            message: props => `${props.value} is not a valid IFSC code!`
        }
    },
    bankname: {
        type: String,
        required: true
    },
    acbranch: {
        type: String,
        required: true
    },
    manageby: {
        type: String,
        required: true
    },
    background: {
        type: String,
        required: true
    },
    incentiveonvisit: {
        type: Number, // Fee-related fields should be numbers
        required: true
    },
    consfee: {
        type: Number,
        required: true
    },
    secondshiftfee: {
        type: Number,
        required: true
    },
    emergencyfee: {
        type: Number,
        required: true
    },
    revisitfeeafter: {
        type: Number,
        required: true
    },
    visitschedule: {
        type: String,
        required: true
    },
    tpp: {
        type: String,
        required: true
    },
    ppd: { 
        type: String,
        required: true
    },
    header: {
        type: String,
        required: true
    },
    footer: {
        type: String,
        required: true
    },
    footerheight: {
        type: String,
        required: true
    },
    profile: {
        type: String, // Assuming it's a URL or file path, this should still be a string
        required: false // Make optional if not every doctor will have a profile image
    },
});

module.exports = mongoose.model('doctor', DoctorSchema);
