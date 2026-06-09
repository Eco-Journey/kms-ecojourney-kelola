import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { User } from '../App';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (userData: User) => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps): React.ReactElement {
  const [email, setEmail] = useState<string>('john.doe@gmail.com');
  const [password, setPassword] = useState<string>('password123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan Password wajib diisi.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Mock loading delay to demonstrate transition and loader state
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Budi',
        email: email,
        role: 'Administrator',
        username: '@budijagobanget'
      });
      onNavigate('dashboard');
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-kms-gray-bg py-16 px-4 w-full">
      <div className="w-full max-w-md space-y-8">
        
        {/* Main Login Card */}
        <div className="bg-white p-8 rounded-[5px] shadow-sm border border-gray-200/60 text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Login
          </h1>
          <p className="text-sm text-gray-600 mb-6 font-normal">
            Login with the data you entered during your registration.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-kms-red bg-red-50 p-2.5 rounded-[5px] border border-red-200">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-kms-blue-accent focus:ring-1 focus:ring-kms-blue-accent/20 placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="**********"
                  className="w-full border border-gray-300 rounded-[5px] px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-kms-blue-accent focus:ring-1 focus:ring-kms-blue-accent/20 placeholder-gray-400"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-kms-blue-accent hover:bg-blue-700 active:scale-98 disabled:opacity-75 disabled:pointer-events-none text-white text-sm font-bold py-3 rounded-[5px] transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Reset Password */}
          <div className="text-right mt-4">
            <button 
              onClick={() => alert('Fitur reset password belum tersedia pada prototipe.')}
              className="text-xs text-gray-600 hover:text-kms-blue-accent hover:underline font-normal cursor-pointer"
            >
              Did you forget your password?
            </button>
          </div>
        </div>

        {/* Bottom Sign Up Container */}
        <div className="bg-white p-8 rounded-[5px] shadow-sm border border-gray-200/60 text-left space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900">
            Sign up
          </h2>
          <p className="text-sm text-gray-600 font-normal">
            Login with the data you entered during your registration.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            disabled={isLoading}
            className="w-full bg-[#EBF5FF] hover:bg-[#D5E6FE] active:scale-98 text-kms-blue-accent text-sm font-bold py-3 rounded-[5px] transition-all duration-200 cursor-pointer text-center block"
          >
            Create account
          </button>
        </div>

      </div>
    </div>
  );
}
