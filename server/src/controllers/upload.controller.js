const { uploadToCloudinary } = require('../services/cloudinary.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// POST /api/upload — Generic single or multi file upload to Cloudinary
const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendError(res, 'No files uploaded.', 422);
  }

  const folder = req.query.folder || 'general';
  const results = [];

  for (const file of req.files) {
    const isVideo = file.mimetype.startsWith('video/');
    const { url, publicId } = await uploadToCloudinary(
      file.buffer,
      folder,
      isVideo ? 'video' : 'image'
    );
    results.push({ url, publicId, originalName: file.originalname });
  }

  return sendSuccess(res, { files: results }, `${results.length} file(s) uploaded successfully`);
};

module.exports = { uploadFiles };
