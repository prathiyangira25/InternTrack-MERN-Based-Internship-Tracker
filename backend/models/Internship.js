const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true,
    match: [
      /^\d{4}-\d{2}$/,
      'Batch should be in format: YYYY-YY'
    ]
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  internshipType: {
    type: String,
    enum: ['Academic', 'Industry'],
    required: true
  },
  obtainedThroughCDC: {
    type: Boolean,
    required: true
  },
  internshipLocation: {
    type: String,
    enum: ['India', 'Abroad'],
    required: true
  },
  internshipStartDate: {
    type: Date,
    required: true
  },
  internshipEndDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in days
    required: true
  },
  stipend: {
    type: Number,
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    match: [
      /^\d{4}-\d{4}$/,
      'Academic year should be in format: YYYY-YYYY'
    ]
  },
  offerLetterFile: {
    fileId: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    webViewLink: {
      type: String,
      required: true
    }
  },
  permissionLetterFile: {
    fileId: {
      type: String
    },
    fileName: {
      type: String
    },
    webViewLink: {
      type: String
    }
  },
  completionCertificateFile: {
    fileId: {
      type: String
    },
    fileName: {
      type: String
    },
    webViewLink: {
      type: String
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  verificationComments: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
InternshipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Internship', InternshipSchema);