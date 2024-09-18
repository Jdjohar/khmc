const mongoose = require('mongoose');
const { Schema } = mongoose;

const StateSchema = new Schema({

    statename: {
        type: String,
        required: true
    },
    statecode: {
        type: String
    },
})

module.exports = mongoose.model('state', StateSchema);