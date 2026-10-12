import React, { useState, useEffect } from 'react';
import {
  Truck,
  Save,
  RotateCcw,
  History,
  Calendar,
  MapPin,
  Search,
  Check,
  AlertCircle,
  CheckCircle2,
  Calculator,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { INDIAN_STATES } from '../../data/indianStates';
import { calculateShipping } from '../../utils/shippingCalculator';

export const AdminShippingRates = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Rate data from API
  const [ratesData, setRatesData] = useState({
    weightSlabs: [],
    zoneMetroStates: [],
    storeOriginState: 'Punjab',
    storeOriginCity: 'Sirhind',
    lastUpdatedAt: null,
    lastUpdatedBy: 'System',
    previousVersions: [],
  });

  // UI States
  const [activeSection, setActiveSection] = useState('rates'); // 'rates' | 'zones' | 'history' | 'simulator'
  const [searchQuery, setSearchQuery] = useState('');
  const [saveNote, setSaveNote] = useState('');

  // Simulator State
  const [simWeight, setSimWeight] = useState(300);
  const [simState, setSimState] = useState('Delhi');
  const [simCity, setSimCity] = useState('');
  const [simPin, setSimPin] = useState('110001');

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const data = await adminService.getShippingRates();
      if (data) {
        setRatesData({
          weightSlabs: data.weightSlabs || [],
          zoneMetroStates: (data.zoneMetroStates || []).map((s) => s.toLowerCase()),
          storeOriginState: data.storeOriginState || 'Punjab',
          storeOriginCity: data.storeOriginCity || 'Sirhind',
          lastUpdatedAt: data.lastUpdatedAt,
          lastUpdatedBy: data.lastUpdatedBy || 'Admin',
          previousVersions: data.previousVersions || [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch shipping rates:', err);
      showToast('Failed to load shipping rates from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (index, field, value) => {
    const val = Math.max(0, Number(value) || 0);
    setRatesData((prev) => {
      const updatedSlabs = [...prev.weightSlabs];
      updatedSlabs[index] = {
        ...updatedSlabs[index],
        [field]: val,
      };
      return { ...prev, weightSlabs: updatedSlabs };
    });
  };

  const toggleMetroState = (stateName) => {
    const normalized = stateName.toLowerCase().trim();
    setRatesData((prev) => {
      const current = prev.zoneMetroStates || [];
      const exists = current.includes(normalized);
      const updated = exists
        ? current.filter((s) => s !== normalized)
        : [...current, normalized];
      return { ...prev, zoneMetroStates: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        weightSlabs: ratesData.weightSlabs,
        zoneMetroStates: ratesData.zoneMetroStates,
        storeOriginState: ratesData.storeOriginState,
        storeOriginCity: ratesData.storeOriginCity,
        note: saveNote || 'Speed Post tariff updated via Admin panel',
      };
      const result = await adminService.updateShippingRates(payload);
      if (result) {
        setRatesData({
          weightSlabs: result.weightSlabs || ratesData.weightSlabs,
          zoneMetroStates: (result.zoneMetroStates || []).map((s) => s.toLowerCase()),
          storeOriginState: result.storeOriginState || ratesData.storeOriginState,
          storeOriginCity: result.storeOriginCity || ratesData.storeOriginCity,
          lastUpdatedAt: result.lastUpdatedAt,
          lastUpdatedBy: result.lastUpdatedBy || 'Admin',
          previousVersions: result.previousVersions || [],
        });
        setSaveNote('');
        showToast('Speed Post shipping rates saved successfully!', 'success');
      }
    } catch (err) {
      console.error('Failed to save shipping rates:', err);
      showToast('Error saving shipping rates to server', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'Are you sure you want to restore the official India Post August 2026 default tariff? Any unsaved or customized slab rates will be overwritten.'
      )
    ) {
      return;
    }
    setResetting(true);
    try {
      const result = await adminService.resetShippingRates();
      if (result) {
        setRatesData({
          weightSlabs: result.weightSlabs || [],
          zoneMetroStates: (result.zoneMetroStates || []).map((s) => s.toLowerCase()),
          storeOriginState: result.storeOriginState || 'Punjab',
          storeOriginCity: result.storeOriginCity || 'Sirhind',
          lastUpdatedAt: result.lastUpdatedAt,
          lastUpdatedBy: result.lastUpdatedBy || 'Admin',
          previousVersions: result.previousVersions || [],
        });
        showToast('Rates reset to official India Post tariff', 'info');
      }
    } catch (err) {
      console.error('Failed to reset shipping rates:', err);
      showToast('Failed to reset shipping rates', 'error');
    } finally {
      setResetting(false);
    }
  };

  // Filter slabs for search
  const filteredSlabs = (ratesData.weightSlabs || []).filter((slab) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const grams = String(slab.maxGrams);
    const kg = (slab.maxGrams / 1000).toFixed(1);
    return grams.includes(query) || kg.includes(query) || `${slab.maxGrams}g`.includes(query);
  });

  // Calculate simulated rate
  const simResult = calculateShipping({
    state: simState,
    city: simCity,
    pincode: simPin,
    totalWeightGrams: Number(simWeight) || 300,
    customSlabs: ratesData.weightSlabs,
    customMetroStates: ratesData.zoneMetroStates,
  });

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 p-12 text-center shadow-xs">
        <div className="w-10 h-10 border-4 border-[#D91680] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-[#6A758E]">Loading Speed Post tariff matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/50 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#EEF3FA]">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D91680]/10 border border-[#D91680]/20 flex items-center justify-center text-[#D91680] shrink-0 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="font-serif-display font-black text-xl text-[#1A1F2C]">
                  Speed Post Shipping Rate Calculator
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Dynamic Engine Active
                </span>
              </div>
              <p className="text-xs text-[#6A758E] mt-1">
                Manage India Post Speed Post rate cards across 4 shipping zones. Charges are calculated dynamically at checkout based on weight and destination state.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 self-start lg:self-auto shrink-0">
            <button
              onClick={handleReset}
              disabled={resetting || saving}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              title="Reset to official India Post August 2026 rate schedule"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>Reset Tariff</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[#D91680] hover:bg-[#b01066] text-white text-xs font-bold shadow-sm shadow-[#D91680]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Origin & Metadata Badges */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[#FCFBFA] border border-[#EEF3FA] flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black text-[#6A758E] tracking-wider">Store Origin</div>
              <div className="text-xs font-black text-[#1A1F2C]">
                {ratesData.storeOriginCity}, {ratesData.storeOriginState}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FCFBFA] border border-[#EEF3FA] flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black text-[#6A758E] tracking-wider">Last Tariff Revision</div>
              <div className="text-xs font-black text-[#1A1F2C]">
                {ratesData.lastUpdatedAt
                  ? new Date(ratesData.lastUpdatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'August 2026 (Initial Tariff)'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FCFBFA] border border-[#EEF3FA] flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black text-[#6A758E] tracking-wider">Updated By</div>
              <div className="text-xs font-black text-[#1A1F2C] truncate max-w-[150px]">
                {ratesData.lastUpdatedBy || 'System Admin'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center space-x-2 border-b border-[#EEF3FA] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSection('rates')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeSection === 'rates'
                ? 'bg-[#161C2A] text-white shadow-xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C] hover:bg-gray-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tariff Rate Table ({ratesData.weightSlabs.length} Slabs)</span>
          </button>

          <button
            onClick={() => setActiveSection('zones')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeSection === 'zones'
                ? 'bg-[#161C2A] text-white shadow-xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C] hover:bg-gray-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Zone/Metro States ({ratesData.zoneMetroStates.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('simulator')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeSection === 'simulator'
                ? 'bg-[#161C2A] text-white shadow-xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C] hover:bg-gray-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Rate Simulator</span>
          </button>

          <button
            onClick={() => setActiveSection('history')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeSection === 'history'
                ? 'bg-[#161C2A] text-white shadow-xs'
                : 'text-[#6A758E] hover:text-[#1A1F2C] hover:bg-gray-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Version Audit Log ({ratesData.previousVersions?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: RATE TABLE */}
      {activeSection === 'rates' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/50 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
                Official Speed Post Weight Slabs & 4-Zone Matrix
              </h3>
              <p className="text-xs text-[#6A758E]">
                All rates in Indian Rupees (₹), inclusive of India Post GST. Edit any cell inline and click Save Changes.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search slab (e.g. 500, 1000)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#D91680]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161C2A] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-black">Weight Slab</th>
                  <th className="py-3 px-4 font-black">
                    <span className="flex items-center space-x-1">
                      <span>Local</span>
                      <span className="text-[9px] lowercase font-normal opacity-70">(Sirhind)</span>
                    </span>
                  </th>
                  <th className="py-3 px-4 font-black">
                    <span className="flex items-center space-x-1">
                      <span>Within State</span>
                      <span className="text-[9px] lowercase font-normal opacity-70">(Punjab)</span>
                    </span>
                  </th>
                  <th className="py-3 px-4 font-black">
                    <span className="flex items-center space-x-1">
                      <span>Zone / Metro</span>
                      <span className="text-[9px] lowercase font-normal opacity-70">(Configured)</span>
                    </span>
                  </th>
                  <th className="py-3 px-4 font-black">
                    <span className="flex items-center space-x-1">
                      <span>Other States</span>
                      <span className="text-[9px] lowercase font-normal opacity-70">(Rest of India)</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredSlabs.map((slab, i) => {
                  const originalIndex = ratesData.weightSlabs.findIndex(
                    (s) => s.maxGrams === slab.maxGrams
                  );
                  const isKg = slab.maxGrams >= 1000;
                  const label = isKg
                    ? `Up to ${(slab.maxGrams / 1000).toFixed(1).replace('.0', '')} kg`
                    : `Up to ${slab.maxGrams} g`;

                  return (
                    <tr
                      key={slab.maxGrams}
                      className={i % 2 === 0 ? 'bg-white hover:bg-pink-50/20' : 'bg-gray-50/50 hover:bg-pink-50/20'}
                    >
                      <td className="py-2.5 px-4 font-black text-[#1A1F2C]">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-[#D91680]" />
                          <span>{label}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({slab.maxGrams}g)</span>
                        </div>
                      </td>

                      {/* Local ₹ */}
                      <td className="py-2 px-3">
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={slab.local}
                            onChange={(e) => handleRateChange(originalIndex, 'local', e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#1A1F2C] focus:outline-none focus:border-[#D91680] bg-white text-right"
                          />
                        </div>
                      </td>

                      {/* Within State ₹ */}
                      <td className="py-2 px-3">
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={slab.withinState}
                            onChange={(e) => handleRateChange(originalIndex, 'withinState', e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#1A1F2C] focus:outline-none focus:border-[#D91680] bg-white text-right"
                          />
                        </div>
                      </td>

                      {/* Zone / Metro ₹ */}
                      <td className="py-2 px-3">
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#D91680] font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={slab.zoneMetro}
                            onChange={(e) => handleRateChange(originalIndex, 'zoneMetro', e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-pink-200 text-xs font-bold text-[#D91680] focus:outline-none focus:border-[#D91680] bg-pink-50/30 text-right"
                          />
                        </div>
                      </td>

                      {/* Other States ₹ */}
                      <td className="py-2 px-3">
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={slab.otherStates}
                            onChange={(e) => handleRateChange(originalIndex, 'otherStates', e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#1A1F2C] focus:outline-none focus:border-[#D91680] bg-white text-right"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Optional revision note */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Optional audit log note (e.g. Revised tariff per India Post notice)..."
              value={saveNote}
              onChange={(e) => setSaveNote(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#D91680]"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#D91680] text-white text-xs font-bold hover:bg-[#b01066] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Rate Table'}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: ZONE / METRO CONFIGURATION */}
      {activeSection === 'zones' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/50 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EEF3FA]">
            <div>
              <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
                Zone / Metro States Classification (FR-14)
              </h3>
              <p className="text-xs text-[#6A758E] mt-0.5">
                Click any state or Union Territory to toggle whether it qualifies for Speed Post "Zone/Metro" rates versus general "Other States".
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-[#D91680]">
                {ratesData.zoneMetroStates.length} states
              </span>
              <span className="text-gray-400">selected as Zone/Metro</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {INDIAN_STATES.map((state) => {
              const isSelected = ratesData.zoneMetroStates.includes(state.toLowerCase());
              const isOrigin = state.toLowerCase() === ratesData.storeOriginState.toLowerCase();

              return (
                <button
                  key={state}
                  type="button"
                  onClick={() => !isOrigin && toggleMetroState(state)}
                  disabled={isOrigin}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isOrigin
                      ? 'bg-amber-50 border-amber-200 text-amber-900 cursor-not-allowed opacity-80'
                      : isSelected
                      ? 'bg-[#D91680]/10 border-[#D91680] text-[#D91680] font-black shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="block font-bold truncate">{state}</span>
                    {isOrigin && (
                      <span className="text-[10px] text-amber-700 uppercase font-bold">Store Origin</span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#D91680] text-white'
                        : 'border border-gray-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#EEF3FA] flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#D91680] text-white text-xs font-bold hover:bg-[#b01066] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Zone Configuration'}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: RATE SIMULATOR */}
      {activeSection === 'simulator' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/50 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#EEF3FA]">
            <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
              Speed Post Rate Testing Sandbox
            </h3>
            <p className="text-xs text-[#6A758E] mt-0.5">
              Simulate delivery charge calculations with custom weight and destination values to verify tariff accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4 p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <h4 className="text-xs font-black uppercase text-[#1A1F2C] tracking-wider">Test Parameters</h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Parcel Weight (Grams)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="35000"
                    value={simWeight}
                    onChange={(e) => setSimWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 font-bold focus:outline-none focus:border-[#D91680]"
                  />
                  <span className="text-xs font-bold text-gray-500 shrink-0">
                    ≈ {(simWeight / 1000).toFixed(2)} kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Destination State</label>
                <select
                  value={simState}
                  onChange={(e) => setSimState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 font-bold focus:outline-none focus:border-[#D91680]"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City (optional)</label>
                  <input
                    type="text"
                    value={simCity}
                    onChange={(e) => setSimCity(e.target.value)}
                    placeholder="e.g. Sirhind / Mumbai"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 focus:outline-none focus:border-[#D91680]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code (optional)</label>
                  <input
                    type="text"
                    value={simPin}
                    onChange={(e) => setSimPin(e.target.value)}
                    placeholder="e.g. 140406"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-300 focus:outline-none focus:border-[#D91680]"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="p-6 rounded-2xl bg-[#FCFBFA] border border-[#EEF3FA] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#6A758E]">
                    Calculated Result
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#D91680]/10 text-[#D91680] border border-[#D91680]/30">
                    {simResult.zoneLabel}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline space-x-2">
                  <span className="font-serif-display font-black text-4xl text-[#1A1F2C]">
                    ₹{simResult.charge}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">(Speed Post charge)</span>
                </div>

                <div className="mt-6 space-y-2 text-xs border-t border-gray-200/60 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Applicable Zone:</span>
                    <span className="font-bold text-[#1A1F2C]">{simResult.zone}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Weight Band:</span>
                    <span className="font-bold text-[#1A1F2C]">
                      Up to {simResult.slabMaxGrams}g
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Origin:</span>
                    <span className="font-bold text-[#1A1F2C]">
                      {ratesData.storeOriginCity}, {ratesData.storeOriginState}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Customer will see ₹{simResult.charge} added directly to their order total at checkout.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VERSION AUDIT LOG */}
      {activeSection === 'history' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/50 shadow-xs space-y-4">
          <div className="pb-4 border-b border-[#EEF3FA]">
            <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
              Tariff Revision History (FR-15)
            </h3>
            <p className="text-xs text-[#6A758E] mt-0.5">
              Every save action creates an immutable log entry. If India Post revises rates, you have full traceability of previous numbers.
            </p>
          </div>

          {(!ratesData.previousVersions || ratesData.previousVersions.length === 0) ? (
            <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl border border-gray-200">
              <Info className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span>No historical revisions recorded yet. The system is currently running on the default August 2026 tariff.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {ratesData.previousVersions.map((v, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-[#1A1F2C]">{v.note || 'Revised Tariff'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 font-bold">
                        {v.slabsCount || 37} Slabs
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Saved by <span className="font-bold text-gray-700">{v.savedBy || 'Admin'}</span> •{' '}
                      {new Date(v.savedAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>

                  <div className="text-[11px] text-[#D91680] font-bold self-start sm:self-auto">
                    {v.zoneMetroStates?.length || 0} Metro States Configured
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
