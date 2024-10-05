const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExaminationSchema = new Schema({
  examinationName: {
    type: String,
    required: true
  },
  useIn: {
    type: String,
    // enum: ['Both', 'Indoor Only', 'Outdoor Only', 'Direct Patient'],
    required: false
  },
  rate: {
    type: Number,
    required: false
  },
  order: {
    type: String,
    required: false
  },
  gst: {
    type: Number,
    required: false
  },
  inclusiveTax: {
    type: String,
    // enum: ['Yes', 'No'],
    required: false
  },
  hsnCode: {
    type: String,
    required: false
  },
  dataCount: {
    type: Number,
    required: false
  },
  lowerValue: {
    type: Number,
    required: false
  },
  higherValue: {
    type: Number,
    required: false
  },
  normalText: {
    type: String,
    required: false
  },
  repeat: {
    type: String,
    // enum: [
    //   'No', 'Hourly', 'Every 2 Hour', 'Every 3 Hour', 'Every 4 Hour', 
    //   'Every 6 Hour', 'Every 8 Hour', 'Every 12 Hour', 'Every Day', 
    //   'On 1 Day Gap', 'On 2 Day Gap'
    // ],
    required: false
  },
  showData: {
    type: String,
    // enum: ['Yes', 'No'],
    required: false
  },
  for: {
    type: String,
    // enum: [
    //   'NA', '1 Days', '2 to 10', '15', '21', '31', '45', '60 Days / 2 Months', 
    //   '90 Days / 3 Months', '120 Days / 4 Months', '180 Days / 6 Months', 
    //   '270 Days / 9 Months'
    // ],
    required: false
  },
  unit: {
    type: String,
    required: false
  },
  askAddValue: {
    type: String,
    // enum: ['Yes', 'No'],
    required: false
  },
  showAddedData: {
    type: String,
    // enum: ['Yes', 'No'],
    required: false
  },
  resultType: {
    type: String,
    // enum: ['Yes', 'No'],
    required: false
  },
  askAddValueType: {
    type: String,
    // enum: ['Text', 'Number', 'Float', 'Date'],
    required: false
  },

  checkboxOptions: {
    type: [String], // An array of strings to store the selected options
    // enum: ['Warn if Abnormal', 'Alert to take action', 'Ask in Dialysis', 'Ask in Gyne', 'Height', 'Weight', 'BMI', 'EYE'], // Replace with your actual checkbox option values
    default: [] // Default is an empty array, meaning no options selected initially
}
});

module.exports = mongoose.model('Examination', ExaminationSchema);
