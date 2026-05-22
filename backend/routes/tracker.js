const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

const COMPANIES = [
  { name: 'Google', logo: '🔵', difficulty: 'Very High', domains: ['SWE', 'ML', 'Data'], rounds: ['OA', 'Technical x4', 'Behavioral'] },
  { name: 'Amazon', logo: '🟠', difficulty: 'High', domains: ['SWE', 'SDE', 'Cloud'], rounds: ['OA', 'Technical x3', 'Bar Raiser'] },
  { name: 'Microsoft', logo: '🔷', difficulty: 'High', domains: ['SWE', 'PM', 'Cloud'], rounds: ['OA', 'Technical x4', 'HR'] },
  { name: 'Meta', logo: '🔵', difficulty: 'Very High', domains: ['SWE', 'Data', 'ML'], rounds: ['OA', 'Technical x2', 'System Design', 'Behavioral'] },
  { name: 'Apple', logo: '⬛', difficulty: 'Very High', domains: ['iOS', 'SWE', 'ML'], rounds: ['Technical x5', 'Behavioral'] },
  { name: 'Infosys', logo: '🟢', difficulty: 'Medium', domains: ['SWE', 'Analyst', 'Consulting'], rounds: ['Aptitude', 'Technical', 'HR'] },
  { name: 'TCS', logo: '🔵', difficulty: 'Medium', domains: ['SWE', 'Analyst'], rounds: ['TCS NQT', 'Technical', 'HR'] },
  { name: 'Wipro', logo: '🟢', difficulty: 'Medium', domains: ['SWE', 'Analyst'], rounds: ['Aptitude', 'Technical', 'HR'] },
  { name: 'Flipkart', logo: '🟡', difficulty: 'High', domains: ['SWE', 'Data', 'PM'], rounds: ['OA', 'Technical x3', 'HR'] },
  { name: 'Razorpay', logo: '🔵', difficulty: 'High', domains: ['SWE', 'Data'], rounds: ['OA', 'Technical x3', 'Culture Fit'] },
];

// GET /api/tracker/companies
router.get('/companies', protect, (req, res) => {
  res.json({ success: true, companies: COMPANIES });
});

// GET /api/tracker/progress
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const Submission = require('../models/Submission');
    const InterviewSession = require('../models/InterviewSession');

    const submissions = await Submission.countDocuments({ user: req.user._id });
    const acceptedSubmissions = await Submission.countDocuments({ user: req.user._id, status: 'accepted' });
    const interviews = await InterviewSession.countDocuments({ user: req.user._id, status: 'completed' });
    const avgScore = await InterviewSession.aggregate([
      { $match: { user: user._id, status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$score' } } },
    ]);

    res.json({
      success: true,
      progress: {
        resumeAnalyzed: !!user.resumeAnalysis,
        resumeScore: user.resumeAnalysis?.overallScore || 0,
        totalSubmissions: submissions,
        acceptedSubmissions,
        solvedRate: submissions > 0 ? Math.round((acceptedSubmissions / submissions) * 100) : 0,
        interviewsCompleted: interviews,
        avgInterviewScore: avgScore[0]?.avg || 0,
        points: user.points,
        streak: user.streak,
        placementStatus: user.placementStatus,
        roadmapProgress: user.roadmap?.length || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tracker/activity
router.get('/activity', protect, async (req, res) => {
  try {
    const Submission = require('../models/Submission');
    const InterviewSession = require('../models/InterviewSession');

    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    const interviews = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const activity = [
      ...submissions.map(s => ({
        id: s._id,
        type: 'coding',
        title: s.problem,
        status: s.status,
        score: s.score,
        date: s.createdAt,
      })),
      ...interviews.map(i => ({
        id: i._id,
        type: 'interview',
        title: `Mock Interview: ${i.role}`,
        status: i.status,
        score: i.score,
        date: i.createdAt,
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/tracker/status
router.put('/status', protect, async (req, res) => {
  try {
    const { placementStatus } = req.body;
    await User.findByIdAndUpdate(req.user._id, { placementStatus });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
