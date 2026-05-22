const express = require('express');
const { protect } = require('../middleware/auth');
const { getModel } = require('../config/gemini');
const User = require('../models/User');

const router = express.Router();

// GET /api/roadmap/generate
router.post('/generate', protect, async (req, res) => {
  try {
    const user = req.user;
    const { targetRole, targetCompany, timelineWeeks } = req.body;

    const model = getModel();
    const prompt = `Create a detailed personalized placement preparation roadmap for a student.

Student Profile:
- Name: ${user.name}
- Target Role: ${targetRole || user.targetRole || 'Software Engineer'}
- Target Companies: ${targetCompany || (user.targetCompanies || []).join(', ') || 'Top tech companies'}
- Current Skills: ${(user.skills || []).join(', ') || 'Basic programming knowledge'}
- Timeline: ${timelineWeeks || 12} weeks
- Resume Analysis Score: ${user.resumeAnalysis?.overallScore || 'Not analyzed'}

Generate a JSON roadmap:
{
  "title": "<personalized roadmap title>",
  "summary": "<2-3 sentence summary>",
  "weeks": [
    {
      "week": <number>,
      "theme": "<theme>",
      "goals": ["<goal1>", ...],
      "topics": ["<topic1>", ...],
      "resources": [{ "title": "<title>", "type": "article|video|course|practice", "url": "" }],
      "tasks": ["<task1>", ...],
      "estimatedHours": <number>
    }
  ],
  "milestones": [
    { "week": <number>, "title": "<milestone>", "description": "<desc>" }
  ],
  "skillGaps": ["<skill to learn>", ...],
  "keyFocusAreas": ["<area>", ...]
}
Return ONLY JSON.`;

    const result = await model.generateContent(prompt);
    const roadmap = JSON.parse(result.response.text().replace(/```json\n?|```/g, '').trim());

    await User.findByIdAndUpdate(req.user._id, { roadmap: roadmap.weeks });

    res.json({ success: true, roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/roadmap/
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, roadmap: user.roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
