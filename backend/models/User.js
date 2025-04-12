const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'coordinator'],
    default: 'student'
  },
  registrationNumber: {
    type: String,
    required: function() {
      return this.role === 'student'; // Only required for students
    },
    unique: function() {
      return this.role === 'student'; // Only unique for students
    },
    validate: {
      validator: function(v) {
        // Skip validation if coordinator
        if (this.role === 'coordinator') return true;
        return /^\d{13}$/.test(v); // Validate 13 digits
      },
      message: props => `${props.value} is not a valid registration number! Must be 13 digits.`
    }
  },
  batch: {
    type: String,
    required: function() { return this.role === 'student'; },
    // Format: "2022-26"
    match: [
      /^\d{4}-\d{2}$/,
      'Batch should be in format: YYYY-YY'
    ]
  },
  mobileNumber: {
    type: String,
    required: function() { return this.role === 'student'; },
    match: [
      /^\d{10}$/,
      'Mobile number should be 10 digits'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);