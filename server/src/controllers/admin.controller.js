const Admin = require('../models/admin.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/admin/manage — List all admin accounts (Main Admin only)
const listAdmins = async (req, res) => {
  const admins = await Admin.find()
    .populate('createdBy', 'name username')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { admins });
};

// POST /api/admin/manage — Create new admin (Main Admin only)
const createAdmin = async (req, res) => {
  const { name, username, password, role } = req.body;

  const existing = await Admin.findOne({ username });
  if (existing) return sendError(res, 'Username already taken.', 409);

  const admin = await Admin.create({
    name,
    username,
    passwordHash: password, // bcrypt pre-save hook will hash this
    role: role || 'admin',
    createdBy: req.admin.id,
  });

  return sendSuccess(
    res,
    { admin: { id: admin._id, name: admin.name, username: admin.username, role: admin.role } },
    'Admin account created',
    201
  );
};

// PUT /api/admin/manage/:id — Update admin (Main Admin only)
const updateAdmin = async (req, res) => {
  const { name, isActive, role } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (isActive !== undefined) updates.isActive = isActive;
  if (role) updates.role = role;

  // Prevent disabling yourself
  if (req.params.id === req.admin.id && isActive === false) {
    return sendError(res, 'You cannot deactivate your own account.', 400);
  }

  const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!admin) return sendError(res, 'Admin not found.', 404);
  return sendSuccess(res, { admin }, 'Admin updated');
};

// DELETE /api/admin/manage/:id — Delete admin (Main Admin only)
const deleteAdmin = async (req, res) => {
  if (req.params.id === req.admin.id) {
    return sendError(res, 'You cannot delete your own account.', 400);
  }
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return sendError(res, 'Admin not found.', 404);
  return sendSuccess(res, null, 'Admin account deleted');
};

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin };
