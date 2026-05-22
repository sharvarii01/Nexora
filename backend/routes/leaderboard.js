const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// GET /api/leaderboard
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({})
      .select('name avatar points streak targetRole college placementStatus')
      .sort({ points: -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      points: user.points,
      streak: user.streak,
      targetRole: user.targetRole,
      college: user.college,
      placementStatus: user.placementStatus,
      isCurrentUser: user._id.toString() === req.user._id.toString(),
    }));

    const currentUserRank = leaderboard.find(u => u.isCurrentUser);

    res.json({ success: true, leaderboard, currentUserRank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
