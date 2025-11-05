import React, { useState } from 'react';
import { Mail, Lock, User, Video, MessageCircle, Sparkles, Eye, EyeOff, ArrowRight, Globe, Users, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();

  const [signUpData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreedToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Welcome to LinguaConnect! Your account has been created successfully.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate('/');
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!signUpData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (signUpData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!signUpData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!signUpData.password) {
      newErrors.password = 'Password is required';
    } else if (signUpData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!signUpData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate(signUpData);
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
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-[#fca311]/5 rounded-full blur-2xl animate-pulse"></div>
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
          <h2 className="text-3xl font-bold text-white">Join Our Community</h2>
          <p className="text-[#e5e5e5]/70 text-lg">Start your language learning journey today</p>
        </div>

        {/* Enhanced Signup Card */}
        <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-8 border border-[#14213d] shadow-2xl shadow-[#000000]/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                <User className="w-4 h-4 text-[#fca311]" />
                Full Name
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'fullName' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type="text"
                  name="fullName"
                  value={signUpData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your full name"
                  className={`w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/40 pl-12 pr-4 py-4 rounded-xl border transition-all duration-200 ${
                    errors.fullName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : focusedField === 'fullName' 
                        ? 'border-[#fca311] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20' 
                        : 'border-[#14213d] hover:border-[#14213d]/80'
                  } backdrop-blur-sm`}
                />
                <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'fullName' ? 'text-[#fca311]' : 'text-[#e5e5e5]/40'
                }`} />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

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
                  value={signUpData.email}
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
              <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                <Lock className="w-4 h-4 text-[#fca311]" />
                Password
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={signUpData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                  placeholder="Create a strong password"
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

            {/* Terms Agreement */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={signUpData.agreedToTerms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                    signUpData.agreedToTerms
                      ? 'bg-[#fca311] border-[#fca311]'
                      : errors.agreedToTerms
                        ? 'bg-red-500/10 border-red-500'
                        : 'bg-[#000000]/60 border-[#14213d] group-hover:border-[#fca311]/50'
                  }`}>
                    {signUpData.agreedToTerms && (
                      <svg className="w-3 h-3 text-[#000000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[#e5e5e5] text-sm leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[#fca311] font-medium hover:text-[#fca311]/80 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#fca311] font-medium hover:text-[#fca311]/80 transition-colors">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {errors.agreedToTerms}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8 pt-6 border-t border-[#14213d]">
            <p className="text-[#e5e5e5]/60">
              Already have an account?{' '}
              <a href="/login" className="text-[#fca311] font-semibold hover:text-[#fca311]/80 inline-flex items-center gap-2 transition-colors group">
                Sign in here
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
              <span>10K+ Language Learners</span>
            </div>
            <div className="flex items-center gap-2 text-[#e5e5e5]/40">
              <Globe className="w-4 h-4" />
              <span>50+ Countries</span>
            </div>
          </div>
          <p className="text-[#e5e5e5]/40 text-sm">
            Connect with language partners worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;