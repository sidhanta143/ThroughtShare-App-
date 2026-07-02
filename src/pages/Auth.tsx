import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppState } from '../context/AppContext';
import { Lock, Mail, User, ShieldCheck, RefreshCw, Eye, EyeOff, Info } from 'lucide-react';

export const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { login, register, isLoading } = useAppState();
  const navigate = useNavigate();

  // Login variables
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register variables
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    
    if (!loginEmail || !loginPassword) {
      setErrorText('Please specify both email and password details.');
      return;
    }

    const ok = await login(loginEmail, loginPassword);
    if (ok) {
      navigate('/dashboard');
    } else {
      setErrorText('Invalid email or credentials. Use any credentials to auto-register.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setErrorText('Verify all fields are populated correctly.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorText('Confirmation password does not match.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorText('Credentials require at least 6 characters.');
      return;
    }

    const ok = await register(regName, regEmail, regPassword);
    if (ok) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-brand-bg dark:bg-[#0B0F19] font-sans transition-colors duration-300">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-550/10 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-550/10 dark:bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating back home link */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 p-2 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow text-indigo-500" />
          <span>Go Back Home</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg mb-3">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-950 dark:text-white">TransForma Portal</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
            Access secure client conversion and packing systems
          </p>
        </div>

        {/* Floating card wrapper */}
        <div className="bg-white/80 dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          
          {/* Tab Selector */}
          <div className="flex border-b border-gray-50 dark:border-zinc-800 p-2">
            <button
              onClick={() => { setActiveTab('login'); setErrorText(''); }}
              className={`flex-1 text-center py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-450 dark:text-zinc-400 hover:text-gray-700'
              }`}
            >
              Sign In Session
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorText(''); }}
              className={`flex-1 text-center py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-450 dark:text-zinc-400 hover:text-gray-700'
              }`}
            >
              Register Workspace
            </button>
          </div>

          <div className="p-6">
            {errorText && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-xs font-semibold text-red-655 dark:text-red-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorText}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-450 dark:text-zinc-550" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. name@company.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Security Password</label>
                      <button type="button" className="text-[10px] text-indigo-500 hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-455 dark:text-zinc-550" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-455 hover:text-gray-700 dark:hover:text-zinc-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-gray-550 dark:text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-200 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>Remember my session</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-150/40 dark:shadow-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Sign In to Dashboard'
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-450 dark:text-zinc-550" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-450 dark:text-zinc-550" />
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Create Password (min. 6 chars)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-455 dark:text-zinc-550" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400">Confirm Security Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-455 dark:text-zinc-550" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-950/30 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-150/40 dark:shadow-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Register and Sign In'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Quick Helper Note for Simplicity */}
            <div className="mt-6 p-3 rounded-xl bg-gray-50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-450 dark:text-zinc-455 leading-relaxed">
                <strong>Sandbox Sandbox Mode:</strong> For rapid preview testing, any email/password combo typed on login will automatically provision a responsive mock workspace. Feel free to try!
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
