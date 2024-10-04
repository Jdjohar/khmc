const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoctorSchema = new Schema({
    type: {
        type: String,
       
    },
    doctorname: {
        type: String,
       
    },
    doctordepartment: {
        type: String,
       
    },
    doctorstatus: {
        type: String,
       
    },
    doctoraddress: {
        type: String,
       
    },
    city: {
        type: String,
       
    },
    mobilenumber: {
        type: String,
        
        // validate: {
        //     validator: function (v) {
        //         return /^\d{10,15}$/.test(v); // Ensures a mobile number is 10-15 digits long
        //     },
        //     message: props => `${props.value} is not a valid mobile number!`
        // }
    },
    dob: {
        type: Date, // Use Date type for birthdate
       
    },
    dom: {
        type: Date, // Use Date type for date of membership
       
    },
    email: {
        type: String,
       
        // validate: {
        //     validator: function (v) {
        //         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
        //     },
        //     message: props => `${props.value} is not a valid email!`
        // }
    },
    accountnumber: {
        type: String,
       
        // validate: {
        //     validator: function (v) {
        //         return /^\d{9,18}$/.test(v); // Ensures account number is 9-18 digits
        //     },
        //     message: props => `${props.value} is not a valid account number!`
        // }
    },
    ifsccode: {
        type: String,
       
        // validate: {
        //     validator: function (v) {
        //         return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // Simple IFSC code validation
        //     },
        //     message: props => `${props.value} is not a valid IFSC code!`
        // }
    },
    bankname: {
        type: String,
    
    },
    acbranch: {
        type: String,
       
    },
    manageby: {
        type: String,
       
    },
    background: {
        type: String,
       
    },
    incentiveonvisit: {
        type: Number, // Fee-related fields should be numbers
       
    },
    consfee: {
        type: Number,
       
    },
    secondshiftfee: {
        type: Number,
       
    },
    emergencyfee: {
        type: Number,
       
    },
    revisitfeeafter: {
        type: Number,
        
    },
    visitschedule: {
        type: String,
       
    },
    tpp: {
        type: String,
       
    },
    ppd: { 
        type: String,
      
    },
    header: {
        type: String,
 
    },
    footer: {
        type: String,
    
    },
    footerheight: {
        type: String,
    
    },
    profile: {
        type: String, // Assuming it's a URL or file path, this should still be a string
       
    },
});

module.exports = mongoose.model('doctor', DoctorSchema);
