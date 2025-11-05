import React, { useState } from 'react';
import { Mail, Lock, Video, MessageCircle, Sparkles, Eye, EyeOff, ArrowRight, Zap, Users, Globe } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setServerError("");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Welcome back! Login successful.");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setServerError(msg);
      toast.error("Login failed");
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      loginMutation(loginData);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#000000] to-[#14213d] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fca311]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#14213d]/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-[#fca311]/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#fca311]/20 rounded-2xl blur-xl group-hover:bg-[#fca311]/30 transition-all duration-500"></div>
              <div className="relative bg-[#14213d]/80 backdrop-blur-xl p-4 rounded-2xl border border-[#14213d] shadow-2xl">
                <Video className="w-8 h-8 text-[#fca311]" />
                <MessageCircle className="w-5 h-5 text-[#e5e5e5] absolute -bottom-1 -right-1 bg-[#14213d] rounded-full p-0.5 border border-[#14213d]" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fca311] via-[#e5e5e5] to-[#ffffff] tracking-tight">
             ChatGuy
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-[#e5e5e5]/70 text-lg">Continue your language learning journey</p>
        </div>

        {/* Enhanced Login Card */}
        <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-8 border border-[#14213d] shadow-2xl shadow-[#000000]/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                <Mail className="w-4 h-4 text-[#fca311]" />
                Email Address
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className={`w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/40 pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : focusedField === 'email' 
                        ? 'border-[#fca311] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20' 
                        : 'border-[#14213d] hover:border-[#14213d]/80'
                  } backdrop-blur-sm`}
                />
                <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-[#fca311]' : 'text-[#e5e5e5]/40'
                }`} />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Lock className="w-4 h-4 text-[#fca311]" />
                  Password
                </label>
                <a href="#" className="text-[#fca311] text-sm font-medium hover:text-[#fca311]/80 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/40 pl-12 pr-12 py-4 rounded-xl border transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : focusedField === 'password' 
                        ? 'border-[#fca311] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20' 
                        : 'border-[#14213d] hover:border-[#14213d]/80'
                  } backdrop-blur-sm`}
                />
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-[#fca311]' : 'text-[#e5e5e5]/40'
                }`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 group"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-[#e5e5e5]/40 group-hover:text-[#fca311] transition-colors duration-200" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#e5e5e5]/40 group-hover:text-[#fca311] transition-colors duration-200" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  {serverError}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isPending}
              className="w-full bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading || isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-6 border-t border-[#14213d]">
            <p className="text-[#e5e5e5]/60">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#fca311] font-semibold hover:text-[#fca311]/80 inline-flex items-center gap-2 transition-colors group">
                Create account
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </p>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8 space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-[#e5e5e5]/40">
              <Users className="w-4 h-4" />
              <span>10K+ Users</span>
            </div>
            <div className="flex items-center gap-2 text-[#e5e5e5]/40">
              <Globe className="w-4 h-4" />
              <span>50+ Countries</span>
            </div>
          </div>
          <p className="text-[#e5e5e5]/40 text-sm">
            Join our global community of language learners
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;