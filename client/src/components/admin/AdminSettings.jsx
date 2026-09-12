import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, MessageCircle, ShieldCheck, Mail, Sparkles, AlertTriangle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';

export const AdminSettings = () => {
  const { settings, setSettings, showToast } = useStore();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.updateSettings(formData);
      setSettings(res.settings || formData);
      showToast('Store settings updated successfully!', 'success');
    } catch {
      showToast('Failed to update store settings on server', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      
      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/50 shadow-xs space-y-6">
        
        <div className="pb-4 border-b border-[#EEF3FA]">
          <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
            Store & WhatsApp Business Configuration
          </h3>
          <p className="text-xs text-[#6A758E] mt-0.5">
            Configure contact parameters, announcement ribbon, and ordering phone numbers.
          </p>
        </div>

        {/* WhatsApp Number (Key Integration) */}
        <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 space-y-2">
          <label className="block text-xs font-bold text-[#1A1F2C] flex items-center space-x-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>Store WhatsApp Business Phone Number *</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-800">
              +91
            </span>
            <input
              type="text"
              required
              value={formData.whatsappNumber || ''}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="7009361881"
              className="w-full pl-12 pr-3 py-2.5 text-xs rounded-xl bg-white border border-emerald-300 text-emerald-950 font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>
          <p className="text-[11px] text-[#4B566E]">
            All customer orders, inquiries, and review notifications are directed to this WhatsApp number.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#1A1F2C] mb-1">Brand / Store Name</label>
            <input
              type="text"
              required
              value={formData.storeName || ''}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1F2C] mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={formData.contactEmail || formData.email || ''}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
            Top Banner Announcement Text
          </label>
          <input
            type="text"
            value={formData.announcementText || ''}
            onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#1A1F2C] mb-1">Currency Code</label>
            <input
              type="text"
              value={formData.currency || 'INR'}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1F2C] mb-1">Free Gift / Pouch Threshold (₹)</label>
            <input
              type="number"
              value={formData.freeShippingThreshold || 1499}
              onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#EEF3FA]">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer border border-[#EFC0DA]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Store Configuration'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
