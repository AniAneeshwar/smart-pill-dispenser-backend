const User = require("../models/User");

exports.updateAccessibility = async (req, res) => {
  try {

    const { accessibility_mode, language } = req.body;

    if (!accessibility_mode && !language) {
      return res.status(400).json({
        message: "No settings provided to update"
      });
    }

    const updateFields = {};

    if (accessibility_mode) updateFields.accessibility_mode = accessibility_mode;
    if (language) updateFields.language = language;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Accessibility settings updated",
      user: userData
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};