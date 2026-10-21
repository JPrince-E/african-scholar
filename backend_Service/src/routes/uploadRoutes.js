const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    let fileUrl = req.file.secure_url || req.file.path;
    if (!fileUrl || !fileUrl.startsWith('http')) {
      const filename = req.file.filename || path.basename(req.file.path || '');
      const host = req.get('host');
      const protocol = req.protocol;
      fileUrl = `${protocol}://${host}/uploads/${filename}`;
    }

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
