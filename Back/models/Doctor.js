const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoctorSchema = new Schema({
    type: {
        type: String,
        required: false
    },
    doctorname: {
        type: String,
        required: false
    },
    doctordepartment: {
        type: String,
        required: false
    },
    doctorstatus: {
        type: String,
        required: false
    },
    doctoraddress: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    mobilenumber: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^\d{10,15}$/.test(v); // Ensures a mobile number is 10-15 digits long
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    dob: {
        type: Date, // Use Date type for birthdate
        required: false
    },
    dom: {
        type: Date, // Use Date type for date of membership
        required: false
    },
    email: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    accountnumber: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^\d{9,18}$/.test(v); // Ensures account number is 9-18 digits
            },
            message: props => `${props.value} is not a valid account number!`
        }
    },
    ifsccode: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // Simple IFSC code validation
            },
            message: props => `${props.value} is not a valid IFSC code!`
        }
    },
    bankname: {
        type: String,
        required: false
    },
    acbranch: {
        type: String,
        required: false
    },
    manageby: {
        type: String,
        required: false
    },
    background: {
        type: String,
        required: false
    },
    incentiveonvisit: {
        type: Number, // Fee-related fields should be numbers
        required: false
    },
    consfee: {
        type: Number,
        required: false
    },
    secondshiftfee: {
        type: Number,
        required: false
    },
    emergencyfee: {
        type: Number,
        required: false
    },
    revisitfeeafter: {
        type: Number,
        required: false
    },
    visitschedule: {
        type: String,
        required: false
    },
    tpp: {
        type: String,
        required: false
    },
    ppd: { 
        type: String,
        required: false
    },
    header: {
        type: String,
        required: false
    },
    footer: {
        type: String,
        required: false
    },
    footerheight: {
        type: String,
        required: false
    },
    profile: {
        type: String, // Assuming it's a URL or file path, this should still be a string
        required: false // Make optional if not every doctor will have a profile image
    },
});

module.exports = mongoose.model('doctor', DoctorSchema);
