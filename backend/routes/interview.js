const express = require('express');
const { protect } = require('../middleware/auth');
const { getModel } = require('../config/gemini');
const InterviewSession = require('../models/InterviewSession');

const router = express.Router();

// POST /api/interview/start
router.post('/start', protect, async (req, res) => {
  try {
    const { targetRole, targetCompany, type } = req.body;
    const model = getModel();

    const systemPrompt = `You are an experienced interviewer at ${targetCompany || 'a top tech company'} conducting a ${type || 'mixed'} interview for a ${targetRole} position. 
Start with a warm greeting, introduce yourself, and ask your first interview question. 
Keep each response concise (2-4 sentences max). Ask one question at a time.
After the candidate responds, give brief feedback and ask the next question.`;

    const result = await model.generateContent(systemPrompt);
    const firstMessage = result.response.text();

    const session = await InterviewSession.create({
      user: req.user._id,
      targetRole,
      targetCompany,
      type,
      messages: [{ role: 'model', content: firstMessage }],
    });

    res.json({ success: true, sessionId: session._id, message: firstMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/interview/message
router.post('/message', protect, async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const session = await InterviewSession.findById(sessionId);
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.messages.push({ role: 'user', content: message });

    const model = getModel();
    const chat = model.startChat({
      history: session.messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();
    session.messages.push({ role: 'model', content: aiResponse });
    await session.save();

    res.json({ success: true, message: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/interview/end
router.post('/end', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const model = getModel();
    const transcript = session.messages.map(m => `${m.role === 'model' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n\n');

    const feedbackPrompt = `Based on this interview transcript, provide a JSON evaluation:
${transcript}

Return JSON:
{
  "score": <0-100>,
  "grade": "A|B|C|D|F",
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength>", ...],
  "improvements": ["<area to improve>", ...],
  "communication": <0-100>,
  "technical": <0-100>,
  "confidence": <0-100>,
  "nextSteps": ["<actionable step>", ...]
}
Return ONLY JSON.`;

    const result = await model.generateContent(feedbackPrompt);
    const feedback = JSON.parse(result.response.text().replace(/```json\n?|```/g, '').trim());

    session.status = 'completed';
    session.score = feedback.score;
    session.feedback = JSON.stringify(feedback);
    await session.save();

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/interview/sessions
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .select('-messages')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
