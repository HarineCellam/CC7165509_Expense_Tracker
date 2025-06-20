const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the full profile (excluding sensitive fields if your schema uses select: false or toJSON transform)
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};