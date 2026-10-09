const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const fileUrl = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;

    return res.json({
      success: true,
      file_url: fileUrl,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
