import React, { useState } from 'react';
import { Lock, User, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const AdminLoginPage = ({ onLoginSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const { showToast } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      showToast('Welcome back, Admin!', 'success');
      onLoginSuccess();
    } else {
      setError(res.message || 'Invalid username or password. (Default: admin / Admin@123456)');
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FCFBFA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#B9C9E7]/60 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1A1F2C] text-[#DBE586] mx-auto flex items-center justify-center shadow-lg border border-[#B9C9E7]/40">
            <Lock className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-[#D91680]">
            <Sparkles className="w-3 h-3" />
            <span>Store Administration</span>
          </div>
          <h2 className="text-2xl font-serif-display font-bold text-[#1A1F2C]">
            Countryside Craft Portal
          </h2>
          <p className="text-xs text-[#6A758E]">
            Manage products, incoming WhatsApp orders, workshop gallery, and customer reviews.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-2xl bg-[#EEF3FA]/70 border border-[#B9C9E7] text-xs text-[#3E475C] space-y-1">
          <p className="font-bold text-[#1A1F2C] flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D91680]" />
            <span>Default Admin Credentials:</span>
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D91680]">
            <span>User: <strong>admin</strong></span>
            <span>Password: <strong>Admin@123456</strong></span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8E9DBE] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E9DBE] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer border border-[#EFC0DA]"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full text-center text-xs text-[#D91680] hover:underline pt-2 font-bold cursor-pointer"
          >
            ← Return to Storefront
          </button>
        </form>

      </div>
    </div>
  );
};
