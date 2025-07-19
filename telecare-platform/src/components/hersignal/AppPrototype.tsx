"use client";

import React, { useState, useEffect, useCallback } from "react";

const PROTOTYPE_IMAGES = [
  {
    id: 1,
    src: "/hersignal/prototype-1.png",
    alt: "HerSignal main dashboard showing signal strength monitoring",
    title: "Dashboard Overview",
    description: "Real-time signal monitoring and analysis interface"
  },
  {
    id: 2,
    src: "/hersignal/prototype-2.png", 
    alt: "HerSignal data visualization charts and graphs",
    title: "Data Analytics",
    description: "Advanced data visualization and reporting tools"
  },
  {
    id: 3,
    src: "/hersignal/prototype-3.png",
    alt: "HerSignal mobile app interface for field monitoring",
    title: "Mobile Interface", 
    description: "Mobile-optimized interface for field data collection"
  },
  {
    id: 4,
    src: "/hersignal/prototype-4.png",
    alt: "HerSignal alert system and notification center",
    title: "Alert System",
    description: "Real-time alerts and notification management"
  },
  {
    id: 5,
    src: "/hersignal/prototype-5.png",
    alt: "HerSignal configuration and settings panel",
    title: "Configuration",
    description: "System configuration and customization options"
  },
  {
    id: 6,
    src: "/hersignal/prototype-6.png",
    alt: "HerSignal team collaboration workspace",
    title: "Collaboration",
    description: "Team workspace for collaborative analysis"
  }
] as const;

export const AppPrototype: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, boolean>>({});

  // Preload images for better performance
  useEffect(() => {
    PROTOTYPE_IMAGES.forEach((image) => {
      const img = new Image();
      img.onload = () => {
        setImageLoadStates(prev => ({ ...prev, [image.id]: true }));
      };
      img.src = image.src;
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % PROTOTYPE_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + PROTOTYPE_IMAGES.length) % PROTOTYPE_IMAGES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section 
      className="py-24 md:py-32 relative overflow-hidden medical-gradient"
      role="region"
      aria-label="app prototype showcase"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-medical-blue-400 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-medical-green-400 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <div data-testid="app-prototype-container" className="container-responsive relative z-10">
        <div className="text-center max-w-5xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-blue-100 rounded-full text-medical-blue-700 font-medium text-sm mb-6">
            🚀 Interactive Demo
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            <span className="text-gradient">App Prototype</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Explore the HerSignal platform interface with our interactive prototype showcase
          </p>
        </div>

        {/* Carousel Container */}
        <div className="card-glass p-8 relative group hover-lift">
          <div 
            data-testid="prototype-carousel"
            data-current={currentSlide}
            className="relative overflow-hidden rounded-xl bg-gray-900"
          >
            {/* Main Image Display */}
            <div className="relative aspect-video md:aspect-[16/10]">
              {PROTOTYPE_IMAGES.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentSlide 
                      ? "opacity-100 translate-x-0" 
                      : index < currentSlide 
                        ? "opacity-0 -translate-x-full" 
                        : "opacity-0 translate-x-full"
                  }`}
                >
                  {/* Loading skeleton */}
                  {!imageLoadStates[image.id] && (
                    <div 
                      data-testid={`image-skeleton-${image.id}`}
                      className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 skeleton animate-pulse"
                    />
                  )}
                  
                  {/* Actual image */}
                  <img
                    data-testid={`prototype-image-${image.id}`}
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoadStates[image.id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImageLoadStates(prev => ({ ...prev, [image.id]: true }))}
                  />
                  
                  {/* Image overlay with details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                    <p className="text-white/90 max-w-md">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <button
              aria-label="Previous prototype"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 hover-lift transition-all duration-200 group-hover:opacity-100 opacity-0"
              onClick={prevSlide}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              aria-label="Next prototype"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 hover-lift transition-all duration-200 group-hover:opacity-100 opacity-0"
              onClick={nextSlide}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {PROTOTYPE_IMAGES.map((_, index) => (
              <button
                key={index}
                data-testid={`carousel-dot-${index}`}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-medical-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to prototype ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-medical-blue-500 to-medical-green-500 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentSlide + 1) / PROTOTYPE_IMAGES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {[
            { icon: "📱", title: "Mobile-First Design", description: "Optimized for mobile and tablet interfaces" },
            { icon: "⚡", title: "Real-time Updates", description: "Live data streaming and instant notifications" },
            { icon: "🎨", title: "Modern UI/UX", description: "Clean, intuitive design following best practices" },
            { icon: "🔒", title: "Secure Access", description: "Enterprise-grade security and data protection" },
            { icon: "📊", title: "Advanced Analytics", description: "Comprehensive data analysis and reporting" },
            { icon: "🌐", title: "Global Reach", description: "Multi-language support and worldwide accessibility" }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="card card-medical hover-lift text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-icon mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="card-title mb-2">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-medical-blue-200 shadow-lg hover-lift">
            <div className="w-3 h-3 bg-medical-green-500 rounded-full animate-pulse" />
            <span className="text-medical-blue-700 font-semibold text-lg">
              🚀 Experience the full prototype in our interactive demo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};