import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Shield,
  ShieldCheck,
  Edit2,
  ToggleLeft,
  ToggleRight,
  X,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/formatters';

const ROLE_STYLES = {
  main_admin: 'bg-[#DBE586]/40 text-[#343C05] border border-[#DBE586]',
  admin: 'bg-[#EEF3FA] text-[#1A1F2C] border border-[#B9C9E7]',
};

const ROLE_ICONS = {
  main_admin: ShieldCheck,
  admin: Shield,
};

export const AdminManage = () => {
  const { showToast } = useStore();
  const { admin: currentAdmin } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'admin',
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdmins();
      setAdmins(res.admins || res || []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      showToast('Could not load admin accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormData({ name: '', username: '', password: '', role: 'admin' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || '',
      username: admin.username || '',
      password: '',
      role: admin.role || 'admin',
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      showToast('Name and username are required', 'warning');
      return;
    }
    if (!editingAdmin && !formData.password.trim()) {
      showToast('Password is required for new admins', 'warning');
      return;
    }
    if (formData.password && formData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingAdmin) {
        const payload = { name: formData.name, role: formData.role };
        if (formData.password) payload.password = formData.password;
        await adminService.updateAdmin(editingAdmin._id, payload);
        setAdmins((prev) =>
          prev.map((a) => (a._id === editingAdmin._id ? { ...a, ...payload } : a))
        );
        showToast(`Admin "${formData.username}" updated!`, 'success');
      } else {
        const res = await adminService.createAdmin({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        });
        setAdmins((prev) => [res.admin || res, ...prev]);
        showToast(`Admin account "${formData.username}" created!`, 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save admin account', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (admin) => {
    if (admin._id === currentAdmin?._id) {
      showToast('You cannot deactivate your own account.', 'warning');
      return;
    }
    try {
      await adminService.updateAdmin(admin._id, { isActive: !admin.isActive });
      setAdmins((prev) =>
        prev.map((a) => (a._id === admin._id ? { ...a, isActive: !a.isActive } : a))
      );
      showToast(`Account ${admin.isActive ? 'deactivated' : 'activated'}`, 'success');
    } catch {
      showToast('Failed to update admin status', 'error');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#B9C9E7]/50 shadow-xs">
        <div>
          <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
            Admin Account Management
          </h3>
          <p className="text-xs text-[#6A758E] mt-0.5">
            Create and manage admin logins. Only Main Admin can access this section.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer border border-[#EFC0DA]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Admin</span>
        </button>
      </div>

      {/* Current Account Info */}
      <div className="p-4 rounded-2xl bg-[#EEF3FA]/70 border border-[#B9C9E7] text-xs text-[#1A1F2C] flex items-start space-x-2">
        <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#D91680]" />
        <div>
          <strong>Security Note:</strong> You are logged in as <strong>{currentAdmin?.username}</strong> (Main Admin).
          Admin accounts have access to all store management features except creating/managing other admins.
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#6A758E] text-xs">
            <div className="w-6 h-6 border-2 border-[#D91680] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading admin accounts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EEF3FA]/60 border-b border-[#B9C9E7]/40 text-[#4B566E] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Admin</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3FA]">
                {admins.map((a) => {
                  const RoleIcon = ROLE_ICONS[a.role] || Shield;
                  const isSelf = a._id === currentAdmin?._id || a.username === currentAdmin?.username;
                  return (
                    <tr key={a._id} className="hover:bg-[#EEF3FA]/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#EEF3FA] flex items-center justify-center text-[#D91680] font-black text-sm shrink-0 border border-[#B9C9E7]">
                            {(a.name || a.username || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1F2C]">
                              {a.name || a.username}
                              {isSelf && (
                                <span className="ml-1.5 text-[9px] bg-[#D91680] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[#6A758E] font-mono text-[11px]">@{a.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`flex items-center space-x-1 w-fit px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase ${ROLE_STYLES[a.role] || ROLE_STYLES.admin}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span>{a.role === 'main_admin' ? 'Main Admin' : 'Admin'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${a.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {a.isActive !== false ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#6A758E]">
                        {a.createdAt ? formatDate(a.createdAt) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(a)}
                            className="p-1.5 rounded-lg bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] transition-colors cursor-pointer"
                            title="Edit admin"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => handleToggleActive(a)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                a.isActive !== false
                                  ? 'text-emerald-700 hover:bg-emerald-50'
                                  : 'text-neutral-400 hover:bg-neutral-100'
                              }`}
                              title={a.isActive !== false ? 'Deactivate account' : 'Activate account'}
                            >
                              {a.isActive !== false ? (
                                <ToggleRight className="w-4 h-4" />
                              ) : (
                                <ToggleLeft className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full border border-[#B9C9E7]/60 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF3FA]">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#D91680]" />
                <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
                  {editingAdmin ? `Edit: ${editingAdmin.username}` : 'Create New Admin Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#6A758E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Meera Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Username *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingAdmin}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="meera_admin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">
                  {editingAdmin ? 'New Password (leave empty to keep current)' : 'Password (min 8 chars) *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingAdmin ? '••••••••' : 'Admin@Secret123'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A758E] hover:text-[#1A1F2C] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Admin Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] font-semibold focus:outline-none"
                >
                  <option value="admin">Admin (Product, Orders, Reviews & Gallery)</option>
                  <option value="main_admin">Main Admin (Full Access + Manage Other Admins)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#EEF3FA]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-md border border-[#EFC0DA]"
                >
                  {saving ? 'Saving...' : editingAdmin ? 'Save Changes' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3.5 rounded-2xl bg-neutral-100 text-neutral-800 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
