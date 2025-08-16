const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  studentName: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // We will store the path to the photo
    required: true,
  },
  institution: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
