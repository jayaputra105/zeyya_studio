import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { adminLogin, isAdminLoggedIn } from '@/admin/cmsApi';
import { Lock, Code2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [location, setLocation] = useLocation();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAdminLoggedIn()) {
      setLocation('/admin');
    }
  }, [location, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      toast.success('Login berhasil');
      setLocation('/admin');
    } else {
      toast.error('Password salah');
      setPassword('');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background noise and glow */}
      <div className="absolute inset-0 noise pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#e66000] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Zeyya Studio</h1>
          <p className="text-gray-400">Content Management System</p>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-50"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF6B00]" />
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-colors"
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-6 rounded-xl font-bold text-base transition-colors"
            >
              Masuk Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
        
        <p className="text-center text-xs text-gray-600 mt-8">
          &copy; {new Date().getFullYear()} Zeyya Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
