const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  targetCompany: { type: String, default: '' },
  type: { type: String, enum: ['technical', 'behavioral', 'hr', 'mixed'], default: 'mixed' },
  messages: [{
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  score: { type: Number, default: null },
  feedback: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in seconds
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
