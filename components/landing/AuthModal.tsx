import React, { useState } from 'react';
import {
  X,
  Boxes,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState<string>('alex@learner.dev');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [name, setName] = useState<string>('Alex Reynolds');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess(email);
        onClose();
        setSubmitted(false);
      }, 900);
    }, 500);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md rounded-sm bg-white border border-black/[0.08] shadow-2xl p-6 sm:p-8 space-y-6 text-left relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-sm text-[#666666] hover:text-[#121212] hover:bg-black/[0.04] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#F26A3D] text-white flex items-center justify-center shadow-xs">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-[#121212]">
              {mode === 'signup' ? 'Create Student Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-[#666666]">
              {mode === 'signup'
                ? 'Unlock level 1-8 node curriculum & save progress'
                : 'Access your saved projects and test runs'}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-sm bg-[#287A52]/10 text-[#287A52] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-[#121212]">
              {mode === 'signup' ? 'Account Created!' : 'Logged In!'}
            </h4>
            <p className="text-xs font-mono text-[#666666]">
              Redirecting to TeachFlow Workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-[#806A55] uppercase">
                  Student Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#806A55] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-sm border border-black/[0.08] bg-[#F8F6F0] text-sm text-[#121212] font-medium focus:outline-none focus:ring-2 focus:ring-[#F26A3D] focus:border-transparent transition-all"
                    placeholder="Alex Reynolds"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#806A55] uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#806A55] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-sm border border-black/[0.08] bg-[#F8F6F0] text-sm text-[#121212] font-medium focus:outline-none focus:ring-2 focus:ring-[#F26A3D] focus:border-transparent transition-all"
                  placeholder="alex@learner.dev"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-[#806A55] uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#806A55] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-sm border border-black/[0.08] bg-[#F8F6F0] text-sm text-[#121212] font-medium focus:outline-none focus:ring-2 focus:ring-[#F26A3D] focus:border-transparent transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-sm bg-[#F26A3D] hover:bg-[#D9552A] active:scale-98 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>
                {isSubmitting
                  ? 'Authorizing...'
                  : mode === 'signup'
                  ? 'Start Free Learning'
                  : 'Open IDE Workspace'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mode Switcher */}
            <div className="pt-2 text-center text-xs text-[#666666]">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-[#F26A3D] hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-[#F26A3D] hover:underline cursor-pointer"
                  >
                    Sign Up for Free
                  </button>
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
