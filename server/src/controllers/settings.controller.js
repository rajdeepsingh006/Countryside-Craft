const Settings = require('../models/settings.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/admin/settings or /api/settings
const getSettings = async (req, res) => {
  const settings = await Settings.getSettings();
  return sendSuccess(res, { settings });
};

// PUT /api/admin/settings
const updateSettings = async (req, res) => {
  const settings = await Settings.getSettings();
  const allowed = [
    'shippingNote',
    'announcementBarText',
    'announcementText',
    'whatsappNumber',
    'storeName',
    'contactEmail',
    'email',
    'currency',
    'freeShippingThreshold',
  ];

  allowed.forEach((key) => {
    if (req.body[key] !== undefined) {
      settings[key] = req.body[key];
    }
  });

  await settings.save();
  return sendSuccess(res, { settings }, 'Settings updated successfully');
};

module.exports = { getSettings, updateSettings };
