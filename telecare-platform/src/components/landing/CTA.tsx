"use client";

import React from "react";

export const CTA: React.FC = () => {
  const handleJoinClick = () => {
    // Future: Navigate to registration
  };

  const handleLearnMoreClick = () => {
    // Future: Navigate to information page
  };

  return (
    <section 
      className="py-24 md:py-32 relative overflow-hidden"
      role="region"
      aria-label="call to action for joining the platform"
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-medical-blue-600 via-medical-blue-700 to-medical-red-600" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-medical-green-400/20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div data-testid="cta-container" className="container-responsive relative z-10">
        <div className="text-center max-w-6xl mx-auto text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-sm font-medium mb-8 animate-bounce-subtle">
            🤝 Join the Mission
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
            Join the Mission to
            <br />
            <span className="bg-gradient-to-r from-white via-medical-green-200 to-white bg-clip-text text-transparent animate-text">
              Save Lives in Gaza
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-16 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Connect with medical specialists or volunteer as a UK healthcare professional 
            to provide urgent emergency consultation during this critical humanitarian crisis
          </p>

          {/* Registration Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="card-glass text-left p-8 group hover-lift">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-medical-red-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🏥</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Gaza Clinicians</h3>
                  <div className="text-medical-green-200 text-sm font-medium">Emergency Access</div>
                </div>
              </div>
              
              <p className="text-white/80 mb-8 leading-relaxed">
                Palestinian doctors and medical professionals: Register for free emergency consultation access 
                with verified UK specialists during critical medical emergencies.
              </p>
              
              <button 
                className="btn-primary bg-white text-medical-blue-600 hover:bg-gray-100 w-full group-hover:scale-105 transition-transform"
                onClick={handleJoinClick}
                aria-label="Register as Gaza clinician for emergency consultations"
              >
                <span>🩺</span>
                Register Now
              </button>
            </div>
            
            <div className="card-glass text-left p-8 group hover-lift">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-medical-blue-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">UK Medical Specialists</h3>
                  <div className="text-medical-blue-200 text-sm font-medium">Volunteer Service</div>
                </div>
              </div>
              
              <p className="text-white/80 mb-8 leading-relaxed">
                Volunteer your expertise to provide no-cost emergency medical consultation to Gaza healthcare workers 
                when traditional aid channels are restricted.
              </p>
              
              <button 
                className="btn-outline border-white text-white hover:bg-white hover:text-medical-blue-600 w-full group-hover:scale-105 transition-all"
                onClick={handleJoinClick}
                aria-label="Sign up as UK specialist volunteer"
              >
                <span>🤝</span>
                Sign Up to Help
              </button>
            </div>
          </div>

          {/* Urgency Messaging */}
          <div className="card-glass p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-4 h-4 bg-medical-red-400 rounded-full animate-pulse" />
              <p className="text-xl font-bold text-white">
                🚨 Immediate medical expertise needed today
              </p>
              <div className="w-4 h-4 bg-medical-red-400 rounded-full animate-pulse" />
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed">
              Every consultation can save lives. Join our donation-based humanitarian platform now 
              to bridge the gap between UK medical expertise and Gaza's critical healthcare needs.
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
              <div>
                <div className="text-2xl font-bold text-medical-green-300">24/7</div>
                <div className="text-white/70 text-sm">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-medical-blue-300">Free</div>
                <div className="text-white/70 text-sm">Service</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-medical-red-300">Lives</div>
                <div className="text-white/70 text-sm">At Stake</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};