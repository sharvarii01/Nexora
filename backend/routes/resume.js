const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { protect } = require('../middleware/auth');
const { getModel } = require('../config/gemini');
const User = require('../models/User');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/resume/analyze
router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No resume file uploaded' });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    const targetRole = req.body.targetRole || req.user.targetRole || 'Software Engineer';

    const model = getModel();
    const prompt = `You are an expert technical recruiter and career coach. Analyze this resume for a ${targetRole} position and provide a detailed structured analysis.

Resume Content:
${resumeText}

Provide a JSON response with this exact structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "skills": {
    "technical": ["<skill1>", ...],
    "soft": ["<skill1>", ...],
    "missing": ["<skill that should be added for ${targetRole}>", ...]
  },
  "sections": {
    "experience": { "score": <0-100>, "feedback": "<feedback>" },
    "education": { "score": <0-100>, "feedback": "<feedback>" },
    "projects": { "score": <0-100>, "feedback": "<feedback>" },
    "skills": { "score": <0-100>, "feedback": "<feedback>" }
  },
  "improvements": [
    { "priority": "high|medium|low", "category": "<category>", "suggestion": "<detailed actionable suggestion>" }
  ],
  "keywords": ["<important keyword for ${targetRole}>", ...]
}

Return ONLY the JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json\n?|```/g, '').trim();
    const analysis = JSON.parse(text);

    await User.findByIdAndUpdate(req.user._id, { resumeAnalysis: analysis });

    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to analyze resume. Please try again.' });
  }
});

// GET /api/resume/analysis
router.get('/analysis', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, analysis: user.resumeAnalysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
