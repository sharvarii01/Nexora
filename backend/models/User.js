const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  targetCompanies: [{ type: String }],
  college: { type: String, default: '' },
  branch: { type: String, default: '' },
  graduationYear: { type: Number },
  skills: [{ type: String }],
  points: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  resumeUrl: { type: String, default: '' },
  resumeAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
  roadmap: [{ type: mongoose.Schema.Types.Mixed }],
  placementStatus: {
    type: String,
    enum: ['not_started', 'preparing', 'applied', 'interviewing', 'placed'],
    default: 'not_started',
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
