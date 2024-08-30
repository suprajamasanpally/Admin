const express = require('express');
const router = express.Router();
const ProfessionalInfo = require('../Models/ProfessionalInfo');
const Field = require('../Models/Field');

// Get fields for ProfessionalInfo
router.get("/:email", async (req, res) => {
  try {
    const userInfo = await ProfessionalInfo.findOne({ email: req.params.email });
    const fields = await Field.find({ page: "ProfessionalInfo" }).sort("order");
    res.json({ userInfo, fields });
  } catch (error) {
    console.error("Error fetching professional info:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Save or update professional info for a specific user
router.post("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { body } = req;

    if (!email || !body) {
      return res.status(400).json({ error: "Email and data are required" });
    }

    const existingInfo = await ProfessionalInfo.findOne({ email });
    if (existingInfo) {
      existingInfo.experiences = body.experiences; // Update experiences
      await existingInfo.save();
    } else {
      const newInfo = new ProfessionalInfo({ email, experiences: body.experiences });
      await newInfo.save();
    }

    res.status(200).json({ message: "Professional info saved successfully" });
  } catch (error) {
    console.error("Error saving professional info:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

module.exports = router;
