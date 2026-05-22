const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: String, required: true },
  problemId: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, enum: ['accepted', 'wrong_answer', 'time_limit', 'error', 'pending'], default: 'pending' },
  runtime: { type: Number, default: 0 },
  memory: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
