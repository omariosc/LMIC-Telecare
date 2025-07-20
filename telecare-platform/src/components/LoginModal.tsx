"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import type { Language, UserRole } from "../types";
import { apiClient } from "../lib/api-client";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userType: "gaza-clinician" | "uk-clinician" | "register-uk";
};

type FormMode = "login" | "register";

// Helper function to determine redirect path based on user role and type
const getRedirectPath = (user: any, userType: string): string => {
  // If user doesn't exist or doesn't have a role, default to demo
  if (!user || !user.role) {
    return "/demo/mobile";
  }

  // Check user role from API response
  switch (user.role) {
    case "gaza_clinician":
    case "gaza-clinician":
      // Gaza clinicians go to mobile demo (they primarily use mobile)
      return "/demo/mobile";
      
    case "uk_specialist":
    case "uk-specialist":
    case "uk_clinician":
    case "uk-clinician":
      // UK clinicians could go to dashboard if it exists, otherwise demo
      // For now, since we only have demo/mobile, send them there too
      // TODO: Create dashboard page for UK specialists
      return "/demo/mobile";
      
    case "admin":
      // Admins would go to admin dashboard if it exists
      return "/demo/mobile";
      
    default:
      // Unknown role, send to demo
      return "/demo/mobile";
  }
};

export default function LoginModal({
  isOpen,
  onClose,
  userType,
}: LoginModalProps) {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [lastUserType, setLastUserType] = useState(userType);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form mode - login or register
  const [mode, setMode] = useState<FormMode>(
    userType === "register-uk" ? "register" : "login"
  );

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    specialties: [] as string[],
    gmcNumber: "",
    bio: "",
  });

  // Keep track of the userType when modal is open to prevent flashing during close transition
  useEffect(() => {
    if (isOpen) {
      setLastUserType(userType);
      setMode(userType === "register-uk" ? "register" : "login");
      // Reset form when opening
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        specialties: [],
        gmcNumber: "",
        bio: "",
      });
      setError(null);
    }
  }, [isOpen, userType]);

  // Read language from localStorage and listen for changes
  useEffect(() => {
    if (!isOpen) return; // Only update when modal is actually open

    const updateLanguage = () => {
      const stored = localStorage.getItem("jusur-language");
      const lang = stored === "ar" || stored === "en" ? stored : "en";
      setCurrentLanguage(lang);
    };

    // Initial load
    updateLanguage();

    // Listen for storage changes (when language toggle is clicked)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jusur-language") {
        updateLanguage();
      }
    };

    // Listen for custom language change events
    const handleLanguageChange = () => {
      updateLanguage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChanged", handleLanguageChange);

    // Also poll for changes as a fallback
    const interval = setInterval(updateLanguage, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChanged", handleLanguageChange);
      clearInterval(interval);
    };
  }, [isOpen]);

  const getTitleContent = () => {
    // Use lastUserType during transitions to prevent flashing
    const activeUserType = isOpen ? userType : lastUserType;

    if (mode === "register") {
      return {
        en: "UK Clinician Registration",
        ar: "تسجيل طبيب بريطاني",
      };
    }

    if (activeUserType === "gaza-clinician") {
      return {
        en: "Gaza Clinician Login",
        ar: "دخول طبيب غزة",
      };
    } else {
      return {
        en: "UK Clinician Login",
        ar: "دخول طبيب بريطاني",
      };
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (mode === "login") {
        // Login request
        result = await apiClient.auth.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Register request
        const role = userType === "gaza-clinician" ? "gaza_clinician" : "uk_specialist";
        
        result = await apiClient.auth.register({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.password, // Simple demo - normally would be separate field
          firstName: formData.firstName,
          lastName: formData.lastName,
          role,
          preferredLanguage: currentLanguage,
          specialties: formData.specialties,
          gmcNumber: formData.gmcNumber || undefined,
          bio: formData.bio || undefined,
          acceptedTerms: true, // Demo - would normally be checkboxes
          acceptedPrivacyPolicy: true,
          acceptedCommunityGuidelines: true,
        });
      }

      // Success! Store token and user data
      if (mode === "login" && result.data?.token) {
        localStorage.setItem("jusur-auth-token", result.data.token);
        localStorage.setItem("jusur-user", JSON.stringify(result.data.user));
        
        // Set token in API client for future requests
        apiClient.setAuthToken(result.data.token);
        
        // Close modal first
        onClose();
        
        // Redirect based on user type and role
        const user = result.data.user;
        const redirectPath = getRedirectPath(user, userType);
        
        // Navigate to appropriate page
        router.push(redirectPath);
      } else if (mode === "register") {
        // Registration successful - show success message or redirect
        onClose();
        // For now, redirect to demo since they need to verify email
        router.push("/demo/mobile");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      specialties: [],
      gmcNumber: "",
      bio: "",
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-80"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-80"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-80 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-80 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 dark:text-white"
                  >
                    {currentLanguage === "ar"
                      ? getTitleContent().ar
                      : getTitleContent().en}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {currentLanguage === "ar" ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={currentLanguage === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {currentLanguage === "ar" ? "كلمة المرور" : "Password"}
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={currentLanguage === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Registration Fields */}
                  {mode === "register" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {currentLanguage === "ar" ? "الاسم الأول" : "First Name"}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {currentLanguage === "ar" ? "اسم العائلة" : "Last Name"}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {userType === "uk-clinician" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {currentLanguage === "ar" ? "رقم GMC" : "GMC Number"}
                          </label>
                          <input
                            type="text"
                            value={formData.gmcNumber}
                            onChange={(e) => handleInputChange("gmcNumber", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={currentLanguage === "ar" ? "اختياري" : "Optional"}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isLoading
                      ? (currentLanguage === "ar" ? "جاري التحميل..." : "Loading...")
                      : mode === "register"
                      ? (currentLanguage === "ar" ? "تسجيل حساب جديد" : "Create Account")
                      : (currentLanguage === "ar" ? "تسجيل الدخول" : "Sign In")
                    }
                  </button>
                </form>

                {/* Mode Switch */}
                {userType !== "register-uk" && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      {mode === "login"
                        ? (currentLanguage === "ar" ? "إنشاء حساب جديد" : "Create new account")
                        : (currentLanguage === "ar" ? "لديك حساب بالفعل؟ تسجيل دخول" : "Already have an account? Sign in")
                      }
                    </button>
                  </div>
                )}

                {/* Demo Link */}
                <div className="mt-4 text-center border-t border-gray-200 dark:border-gray-600 pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {currentLanguage === "ar"
                      ? "تريد تجربة المنصة أولاً؟"
                      : "Want to try the platform first?"}
                  </p>
                  <a
                    href="/demo/mobile"
                    className="text-green-600 hover:text-green-800 text-sm underline"
                    onClick={onClose}
                  >
                    {currentLanguage === "ar"
                      ? "تجربة المنصة"
                      : "Try Demo"}
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}