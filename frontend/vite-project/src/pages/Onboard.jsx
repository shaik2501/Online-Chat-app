import React, { useState } from 'react';
import { User, MessageSquare, Globe, MapPin, Sparkles, ArrowRight, Check, Users, Languages, Map } from 'lucide-react';
import { useAuthUser } from '../hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api';
import { useMutation } from '@tanstack/react-query';

const Onboard = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || ''
  });
  
  const [profilePreview, setProfilePreview] = useState(authUser?.profilePic || null); 
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const { mutate: OnboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async () => {
      toast.success("Profile setup complete! Welcome to LinguaConnect 🎉");
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(`Setup failed: ${error.message || "Please try again"}`);
    }
  });

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Dutch', 'Swedish', 'Turkish', 'Polish', 'Vietnamese', 'Thai'
  ];

  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGenerateProfilePic = async () => {
    setIsGenerating(true);
    toast.loading('Generating your AI profile picture...', { id: 'ai-gen' });
    
    try {
      // Simulate API call with better error handling
      await new Promise(resolve => setTimeout(resolve, 2000));
      const randomSeed = Math.floor(Math.random() * 100) + 1;
      const generatedImageUrl = `https://avatar.iran.liara.run/public/${randomSeed}.png`;
      
      setProfilePreview(generatedImageUrl);
      setProfileData(prev => ({ ...prev, profilePic: generatedImageUrl }));
      toast.success('AI profile picture generated! ✨', { id: 'ai-gen' });
    } catch (error) {
      toast.error('Failed to generate image. Please try again.', { id: 'ai-gen' });
    } finally {
      setIsGenerating(false);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!profileData.fullName.trim()) newErrors.fullName = 'Full name is required';
      else if (profileData.fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters';
      if (!profileData.bio.trim()) newErrors.bio = 'Bio is required';
      else if (profileData.bio.trim().length < 10) newErrors.bio = 'Bio should be at least 10 characters';
    } else if (currentStep === 2) {
      if (!profileData.nativeLanguage) newErrors.nativeLanguage = 'Please select your native language';
      if (!profileData.learningLanguage) newErrors.learningLanguage = 'Please select a language to learn';
      if (profileData.nativeLanguage === profileData.learningLanguage) {
        newErrors.learningLanguage = 'Learning language should be different from native language';
      }
    } else if (currentStep === 3) {
      if (!profileData.location.trim()) newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      if (currentStep === totalSteps) {
        OnboardingMutation(profileData);
      } else {
        handleNext();
      }
    }
  };

  const handleNext = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#000000] to-[#14213d] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fca311]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#14213d]/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-[#fca311]/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-3 bg-[#fca311]/10 px-6 py-3 rounded-2xl border border-[#fca311]/20 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-[#fca311]" />
            <span className="text-sm font-semibold text-[#fca311]">Complete Your Profile</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fca311] via-[#e5e5e5] to-[#ffffff] mb-2 tracking-tight">
            Welcome to LinguaConnect
          </h1>
          <p className="text-[#e5e5e5]/70 text-lg max-w-md mx-auto">
            Let's personalize your language learning experience
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl font-semibold transition-all duration-300 ${
                  step < currentStep 
                    ? 'bg-[#fca311] text-[#000000] shadow-lg shadow-[#fca311]/20' 
                    : step === currentStep 
                    ? 'bg-[#fca311] text-[#000000] scale-110 shadow-xl shadow-[#fca311]/30 border-2 border-[#fca311]' 
                    : 'bg-[#14213d] text-[#e5e5e5]/40 border border-[#14213d]'
                }`}>
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < totalSteps && (
                  <div className={`flex-1 h-2 mx-4 rounded-full transition-all duration-300 ${
                    step < currentStep 
                      ? 'bg-gradient-to-r from-[#fca311] to-[#fca311]/70' 
                      : 'bg-[#14213d]'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-[#e5e5e5]/60 px-4">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Info
            </span>
            <span className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Languages
            </span>
            <span className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Location
            </span>
          </div>
        </div>

        {/* Enhanced Main Card */}
        <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-8 border border-[#14213d] shadow-2xl shadow-[#000000]/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-[#fca311]/10 rounded-xl">
                    <User className="w-6 h-6 text-[#fca311]" />
                  </div>
                  Personal Information
                </h2>

                {/* Enhanced Profile Picture Section */}
                <div className="flex flex-col items-center gap-5 py-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-full opacity-60 blur-lg group-hover:opacity-80 transition-all duration-300"></div>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#14213d] group-hover:border-[#fca311]/50 transition-all duration-300 bg-[#000000]/60">
                      {profilePreview ? (
                        <img 
                          src={profilePreview} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-[#e5e5e5]/30" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[#e5e5e5]/60 text-sm text-center max-w-sm">
                    Create a unique AI-powered profile picture to stand out in the community
                  </p>
                  
                  <button 
                    onClick={handleGenerateProfilePic} 
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate AI Profile Picture
                      </>
                    )}
                  </button>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                    <User className="w-4 h-4 text-[#fca311]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/40 px-4 py-4 rounded-xl border transition-all duration-200 ${
                      errors.fullName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-[#14213d] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20'
                    } backdrop-blur-sm`}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                      <MessageSquare className="w-4 h-4 text-[#fca311]" />
                      Bio
                    </label>
                    <span className="text-[#e5e5e5]/40 text-sm">{profileData.bio.length}/150</span>
                  </div>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    maxLength={150}
                    rows={4}
                    className={`w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/40 px-4 py-4 rounded-xl border transition-all duration-200 resize-none ${
                      errors.bio 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-[#14213d] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20'
                    } backdrop-blur-sm`}
                  />
                  {errors.bio && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.bio}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Languages */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-[#fca311]/10 rounded-xl">
                    <Globe className="w-6 h-6 text-[#fca311]" />
                  </div>
                  Language Preferences
                </h2>

                {/* Native Language */}
                <div className="space-y-2">
                  <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                    <MessageSquare className="w-4 h-4 text-[#fca311]" />
                    Native Language
                  </label>
                  <select
                    name="nativeLanguage"
                    value={profileData.nativeLanguage}
                    onChange={handleChange}
                    className={`w-full bg-[#000000]/60 text-white px-4 py-4 rounded-xl border transition-all duration-200 appearance-none cursor-pointer ${
                      errors.nativeLanguage 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-[#14213d] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20'
                    } backdrop-blur-sm`}
                  >
                    <option value="" className="bg-[#14213d]">Select your native language</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang} className="bg-[#14213d]">{lang}</option>
                    ))}
                  </select>
                  {errors.nativeLanguage && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.nativeLanguage}
                    </p>
                  )}
                </div>

                {/* Learning Language */}
                <div className="space-y-2">
                  <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-[#fca311]" />
                    Language I Want to Learn
                  </label>
                  <select
                    name="learningLanguage"
                    value={profileData.learningLanguage}
                    onChange={handleChange}
                    className={`w-full bg-[#000000]/60 text-white px-4 py-4 rounded-xl border transition-all duration-200 appearance-none cursor-pointer ${
                      errors.learningLanguage 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-[#14213d] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20'
                    } backdrop-blur-sm`}
                  >
                    <option value="" className="bg-[#14213d]">Select a language to learn</option>
                    {languages.filter(lang => lang !== profileData.nativeLanguage).map(lang => (
                      <option key={lang} value={lang} className="bg-[#14213d]">{lang}</option>
                    ))}
                  </select>
                  {errors.learningLanguage && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.learningLanguage}
                    </p>
                  )}
                </div>

                {profileData.nativeLanguage && profileData.learningLanguage && (
                  <div className="bg-[#fca311]/10 border border-[#fca311]/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-[#fca311]" />
                      <div>
                        <p className="text-[#fca311] font-semibold">Perfect match!</p>
                        <p className="text-[#e5e5e5] text-sm">
                          You'll be connecting with <span className="font-semibold">{profileData.learningLanguage}</span> speakers to practice and learn together.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-[#fca311]/10 rounded-xl">
                    <MapPin className="w-6 h-6 text-[#fca311]" />
                  </div>
                  Location Information
                </h2>

                <div className="space-y-2">
                  <label className="text-[#e5e5e5] font-medium flex items-center gap-2 text-sm uppercase tracking-wide">
                    <MapPin className="w-4 h-4 text-[#fca311]" />
                    Your Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className={`w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/40 px-4 py-4 rounded-xl border transition-all duration-200 ${
                      errors.location 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-[#14213d] focus:border-[#fca311] focus:ring-2 focus:ring-[#fca311]/20'
                    } backdrop-blur-sm`}
                  />
                  {errors.location && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Enhanced Summary Card */}
                <div className="bg-[#14213d]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] mt-8">
                  <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#fca311]" />
                    Profile Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#fca311]/10 rounded-xl">
                        <User className="w-4 h-4 text-[#fca311]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{profileData.fullName || 'Not set'}</p>
                        <p className="text-[#e5e5e5] text-sm mt-1">{profileData.bio || 'No bio provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#fca311]/10 rounded-xl">
                        <Languages className="w-4 h-4 text-[#fca311]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#e5e5e5]">
                          <span className="font-semibold text-white">{profileData.nativeLanguage || 'Not set'}</span>
                          {' → '}
                          <span className="font-semibold text-white">{profileData.learningLanguage || 'Not set'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#fca311]/10 rounded-xl">
                        <MapPin className="w-4 h-4 text-[#fca311]" />
                      </div>
                      <p className="text-sm font-semibold text-white">{profileData.location || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-[#14213d]">
              {currentStep > 1 && (
                <button 
                  onClick={handleBack} 
                  disabled={isPending}
                  className="flex-1 bg-[#14213d] text-[#e5e5e5] py-4 px-6 rounded-xl font-semibold border border-[#14213d] hover:border-[#fca311]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
              )}
              <button 
                type={currentStep === totalSteps ? "submit" : "button"}
                onClick={currentStep === totalSteps ? undefined : handleNext}
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                    {currentStep === totalSteps ? 'Completing...' : 'Loading...'}
                  </>
                ) : (
                  <>
                    <span>{currentStep === totalSteps ? 'Complete Setup' : 'Continue'}</span>
                    {currentStep === totalSteps ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8">
          <p className="text-[#e5e5e5]/40 text-sm flex items-center justify-center gap-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>•</span>
            <span>Your information is secure and private</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboard;