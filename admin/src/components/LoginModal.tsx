// admin/src/components/LoginModal.tsx
import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, Mail, Key, LogIn, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  onSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('admin@vedicknowledge.org');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email, password);
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'ప్రవేశం విఫలమైంది. దయచేసి వివరాలు సరిచూసుకోండి.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#241308] border-2 border-[#6E3C14] rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#168FA8] via-[#E7C65A] to-[#75451F]" />

        <div className="text-center mb-6 pt-2">
          <div className="w-12 h-12 rounded-full bg-[#3D2010] border border-[#A66A32] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-[#E7C65A]" />
          </div>
          <h2 className="text-xl font-bold text-[#FFE58F]">నిర్వాహక ప్రవేశం</h2>
          <p className="text-xs text-[#D2AC82] mt-1">Admin Dashboard Authentication</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-800 rounded-lg text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
              ఈమెయిల్ (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A66A32] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1C0D04] border border-[#542E13] rounded-lg pl-9 pr-3 py-2 text-sm text-[#FFF5D0] focus:outline-none focus:border-[#E7C65A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D2AC82] mb-1">
              రహస్య పదం (Password)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#A66A32] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1C0D04] border border-[#542E13] rounded-lg pl-9 pr-3 py-2 text-sm text-[#FFF5D0] focus:outline-none focus:border-[#E7C65A]"
              />
            </div>
            <p className="text-[10px] text-[#A66A32] mt-1">
              డిఫాల్ట్ ప్రవేశ వివరాలు: admin@vedicknowledge.org / admin123
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#75451F] via-[#8D5426] to-[#75451F] hover:brightness-110 text-[#FFF5D0] font-bold rounded-lg text-sm shadow-lg flex items-center justify-center space-x-2 border border-[#9C5D26] mt-2 active:scale-98 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'ధృవీకరిస్తోంది...' : 'ప్రవేశించు (Sign In)'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
