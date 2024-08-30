// routes/themeRoute.js
const express = require('express');
const router = express.Router();

// Endpoint to handle theme change
router.post('/themes', (req, res) => {
  const { theme } = req.body;

  // Validate and apply the theme here
  if (theme && ['black', 'pink', 'lavender', 'light', 'dark'].includes(theme)) {
    // You can store the theme in a database or in-memory store
    // For simplicity, we will just log the theme
    console.log(`Theme received: ${theme}`);
    res.status(200).json({ message: 'Theme applied successfully' });
  } else {
    res.status(400).json({ message: 'Invalid theme' });
  }
});

module.exports = router;
