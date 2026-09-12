import React, { useState } from 'react';
import { Lock, User, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const { showToast } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('artisan2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = login(username, password);
    setLoading(false);

    if (success) {
      showToast('Welcome back, Artisan Admin!', 'success');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. (Hint: admin / artisan2026)');
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DFD0] shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#26221D] text-amber-200 mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-widest text-[#8C5E3C]">
            <Sparkles className="w-3 h-3" />
            <span>Store Administration</span>
          </div>
          <h2 className="text-2xl font-serif-display font-bold text-[#241F18]">
            VANA Artisan Portal
          </h2>
          <p className="text-xs text-[#7A6D5A]">
            Manage products, incoming WhatsApp orders, workshop gallery, and customer reviews.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E0D5C3] text-xs text-[#6B5E4F] space-y-1">
          <p className="font-bold text-[#241F18] flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8C5E3C]" />
            <span>Demo Admin Credentials:</span>
          </p>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8C5E3C]">
            <span>User: <strong>admin</strong></span>
            <span>Password: <strong>artisan2026</strong></span>
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
            <label className="block text-xs font-bold text-[#3B3329] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C7E6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3B3329] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7E6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#3B362F] hover:bg-[#25211C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full text-center text-xs text-[#8C5E3C] hover:underline pt-2 font-medium"
          >
            ← Return to Storefront
          </button>
        </form>

      </div>
    </div>
  );
};
