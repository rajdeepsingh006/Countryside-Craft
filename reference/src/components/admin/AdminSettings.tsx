import React, { useState } from 'react';
import { Save, RefreshCw, MessageCircle, ShieldCheck, Mail, Sparkles, AlertTriangle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetAllData, showToast } = useStore();
  const [formData, setFormData] = useState<StoreSettings>(settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Store settings updated successfully!', 'success');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all mock products, orders, and reviews back to default artisan samples?'
      )
    ) {
      resetAllData();
      showToast('Store data reset to default seed state.', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      
      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD0] shadow-xs space-y-6">
        
        <div className="pb-4 border-b border-[#E8DFD0]">
          <h3 className="font-serif-display font-bold text-lg text-[#241F18]">
            Store & WhatsApp Business Configuration
          </h3>
          <p className="text-xs text-[#7A6D5C] mt-0.5">
            Configure contact parameters, announcement ribbon, and ordering phone numbers.
          </p>
        </div>

        {/* WhatsApp Number (Key Integration) */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
          <label className="block text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
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
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="9876543210"
              className="w-full pl-12 pr-3 py-2.5 text-xs rounded-xl bg-white border border-emerald-300 text-emerald-950 font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>
          <p className="text-[11px] text-emerald-800">
            All customer orders, inquiries, and review notifications are directed to this WhatsApp number.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3329] mb-1">Brand / Store Name</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3329] mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3B3329] mb-1">
            Top Banner Announcement Text
          </label>
          <input
            type="text"
            value={formData.announcementText}
            onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#3B3329] mb-1">Currency Code</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3B3329] mb-1">Free Gift / Pouch Threshold (₹)</label>
            <input
              type="number"
              value={formData.freeShippingThreshold}
              onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8DFD0]">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>

      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-200 shadow-xs space-y-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-red-950">Data Reset & Seed Reload</h4>
            <p className="text-xs text-neutral-600 mt-1">
              Reset all current localStorage products, test orders, and reviews back to the default artisan catalog.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider border border-red-300 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Mock Data to Seed</span>
        </button>
      </div>

    </div>
  );
};
