const express = require('express');
const router = express.Router();
const EducationalInfo = require('../Models/EducationalInfo');
const Field = require('../Models/Field'); 

router.get("/:email", async (req, res) => {
  try {
    const userInfo = await EducationalInfo.findOne({ email: req.params.email });
    const fields = await Field.find({ page: "EducationalInfo" }).sort("order");
    res.json({ userInfo, fields });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const existingInfo = await EducationalInfo.findOne({ email });
    if (existingInfo) {
      Object.assign(existingInfo, req.body);
      await existingInfo.save();
    } else {
      const newInfo = new EducationalInfo({ email, ...req.body });
      await newInfo.save();
    }
    res.status(200).json({ message: "Educational info saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
