"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
  PlusIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userType: "gaza-clinician" | "uk-clinician" | "register-uk";
};

export default function AuthModal({
  isOpen,
  onClose,
  userType,
}: AuthModalProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ar">("en");
  const [lastUserType, setLastUserType] = useState(userType);

  // Keep track of the userType when modal is open to prevent flashing during close transition
  useEffect(() => {
    if (isOpen) {
      setLastUserType(userType);
    }
  }, [isOpen, userType]);

  // Read language from localStorage and listen for changes
  useEffect(() => {
    if (!isOpen) return; // Only update when modal is actually open

    const updateLanguage = () => {
      const stored = localStorage.getItem("jusur-language");
      const lang = (stored === "ar" || stored === "en") ? stored : "en";
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
    
    if (activeUserType === "gaza-clinician") {
      return {
        en: "Gaza Clinician Login",
        ar: "دخول طبيب غزة"
      };
    } else if (activeUserType === "uk-clinician") {
      return {
        en: "UK Clinician Login", 
        ar: "دخول طبيب بريطاني"
      };
    } else {
      return {
        en: "UK Clinician Registration",
        ar: "تسجيل طبيب بريطاني"
      };
    }
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
          <div className="fixed inset-0 bg-black bg-opacity-80" />
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
                id="auth-modal-content"
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900"
                  >
                    {currentLanguage === "ar" ? getTitleContent().ar : getTitleContent().en}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {currentLanguage === "ar" 
                      ? "للوصول إلى منصة جسور الطبية، يرجى تحميل التطبيق على هاتفك. التطبيق مصمم خصيصاً للعمل في بيئات ذات اتصال محدود بالإنترنت."
                      : "To access the Jusur medical platform, please download the app on your phone. The app is specifically designed to work in low-bandwidth environments."
                    }
                  </p>
                </div>

                {/* PWA Installation Instructions */}
                <div className="space-y-4">
                  {/* Android Instructions */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />
                      {currentLanguage === "ar" ? "للهواتف الذكية (أندرويد/أيفون)" : "For Smartphones (Android/iPhone)"}
                    </h4>
                    <ol className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>
                          {currentLanguage === "ar" ? "افتح هذا الموقع في متصفح هاتفك المحمول" : "Open this website in your mobile browser"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <div className="space-y-2">
                          <span>
                            {currentLanguage === "ar" ? "اضغط على زر المشاركة:" : "Tap the share button:"}
                          </span>
                          <div className="flex gap-4">
                            <div className="text-center">
                              <ShareIcon className="h-6 w-6 mx-auto text-blue-600" />
                              <span className="text-xs text-gray-500">
                                {currentLanguage === "ar" ? "أيفون" : "iPhone"}
                              </span>
                            </div>
                            <div className="text-center">
                              <CursorArrowRaysIcon className="h-6 w-6 mx-auto text-green-600" />
                              <span className="text-xs text-gray-500">
                                {currentLanguage === "ar" ? "أندرويد" : "Android"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <div>
                          <span>
                            {currentLanguage === "ar" ? 'اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"' : 'Select "Add to Home Screen" or "Install App"'}
                          </span>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <PlusIcon className="h-4 w-4" />
                            <span>
                              {currentLanguage === "ar" ? "إضافة إلى الشاشة الرئيسية" : "Add to Home Screen"}
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>
                          {currentLanguage === "ar" ? 'اضغط "إضافة" أو "تثبيت" لتأكيد التحميل' : 'Tap "Add" or "Install" to confirm'}
                        </span>
                      </li>
                    </ol>
                  </div>

                  {/* Benefits */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {currentLanguage === "ar" ? "فوائد التطبيق:" : "App Benefits:"}
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {currentLanguage === "ar" ? "يعمل دون اتصال بالإنترنت" : "Works offline"}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {currentLanguage === "ar" ? "محسن للاتصال المحدود" : "Optimized for limited connectivity"}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {currentLanguage === "ar" ? "إشعارات فورية للحالات الطارئة" : "Instant notifications for emergencies"}
                      </li>
                    </ul>
                  </div>

                  {/* Alternative Access */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                      {currentLanguage === "ar" ? "واجهت مشكلة في التحميل؟" : "Having trouble installing?"}
                    </p>
                    <a
                      href="mailto:O.Choudhry@leeds.ac.uk"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      {currentLanguage === "ar" ? "اتصل بفريق الدعم" : "Contact Support Team"}
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
                    onClick={onClose}
                  >
                    {currentLanguage === "ar" ? "إغلاق" : "Close"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
                    onClick={() => {
                      // In a real implementation, this would trigger PWA install prompt
                      if ("serviceWorker" in navigator) {
                        // Trigger PWA install prompt
                        window.location.reload();
                      }
                      onClose();
                    }}
                  >
                    {currentLanguage === "ar" ? "فهمت، دعني أحمل التطبيق" : "Got it, let me install"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
