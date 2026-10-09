const jwt = require('jsonwebtoken');
const { User, ScholarProfile } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_african_scholar_2026');

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'role', 'avatar_url', 'is_verified'],
      include: [{ model: ScholarProfile, as: 'profile' }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or token expired.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
