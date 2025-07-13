const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  data: { type: Buffer, required: true },
});

module.exports = mongoose.model('Resume', ResumeSchema); 