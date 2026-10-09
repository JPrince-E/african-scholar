const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, ScholarProfile } = require('../models');
const emailService = require('../services/emailService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_african_scholar_2026',
    { expiresIn: '30d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Default role is SCHOLAR, unless specified role is allowed
    const userRole = (role && ['SUPER_ADMIN', 'REVIEWER', 'SCHOLAR'].includes(role)) ? role : 'SCHOLAR';

    const user = await User.create({
      email,
      password_hash,
      role: userRole,
      avatar_url: '/default-avatar.svg',
      is_verified: true
    });

    // Send welcome email asynchronously
    emailService.sendWelcomeEmail({
      email: user.email,
      name: user.email.split('@')[0],
      title: 'Scholar'
    }).catch(e => console.error('Failed to send welcome email:', e.message));

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: ScholarProfile, as: 'profile' }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'avatar_url', 'is_verified', 'created_at'],
      include: [{ model: ScholarProfile, as: 'profile' }]
    });

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file && !req.body.avatar_url) {
      return res.status(400).json({ success: false, message: 'No image file or URL provided.' });
    }

    const avatarUrl = req.file ? (req.file.path || req.file.secure_url) : req.body.avatar_url;

    await User.update({ avatar_url: avatarUrl }, { where: { id: req.user.id } });

    return res.json({
      success: true,
      message: 'Avatar updated successfully.',
      avatar_url: avatarUrl
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
