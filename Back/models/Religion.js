const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReligionSchema = new Schema({

    religionname: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('religion', ReligionSchema);