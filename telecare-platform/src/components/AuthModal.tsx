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
import type { Language, UserRole } from "../types";

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
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
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

    if (activeUserType === "gaza-clinician") {
      return {
        en: "Gaza Clinician Login",
        ar: "دخول طبيب غزة",
      };
    } else if (activeUserType === "uk-clinician") {
      return {
        en: "UK Clinician Login",
        ar: "دخول طبيب بريطاني",
      };
    } else {
      return {
        en: "UK Clinician Registration",
        ar: "تسجيل طبيب بريطاني",
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
                id="auth-modal-content"
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

                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentLanguage === "ar"
                      ? "للوصول إلى منصة جسور الطبية، يرجى تحميل التطبيق على هاتفك. التطبيق مصمم خصيصاً للعمل في بيئات ذات اتصال محدود بالإنترنت."
                      : "To access the Jusur medical platform, please download the app on your phone. The app is specifically designed to work in low-bandwidth environments."}
                  </p>
                </div>

                {/* PWA Installation Instructions */}
                <div className="space-y-4">
                  {/* Android Instructions */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-blue-950">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />
                      {currentLanguage === "ar"
                        ? "للهواتف الذكية (أندرويد/أيفون)"
                        : "For Smartphones (Android/iPhone)"}
                    </h4>
                    <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>
                          {currentLanguage === "ar"
                            ? "افتح هذا الموقع في متصفح هاتفك المحمول"
                            : "Open this website in your mobile browser"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <div className="space-y-2">
                          <span>
                            {currentLanguage === "ar"
                              ? "اضغط على زر المشاركة:"
                              : "Tap the share button:"}
                          </span>
                          <div className="flex gap-4 mt-2">
                            <div className="text-center">
                              <ShareIcon className="h-6 w-6 mx-auto text-blue-600" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {currentLanguage === "ar" ? "أيفون" : "iPhone"}
                              </span>
                            </div>
                            <div className="text-center">
                              <CursorArrowRaysIcon className="h-6 w-6 mx-auto text-green-600" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {currentLanguage === "ar"
                                  ? "أندرويد"
                                  : "Android"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <div>
                          <span>
                            {currentLanguage === "ar"
                              ? 'اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق"'
                              : 'Select "Add to Home Screen" or "Install App"'}
                          </span>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <PlusIcon className="h-4 w-4" />
                            <span>
                              {currentLanguage === "ar"
                                ? "إضافة إلى الشاشة الرئيسية"
                                : "Add to Home Screen"}
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>
                          {currentLanguage === "ar"
                            ? 'اضغط "إضافة" أو "تثبيت" لتأكيد التحميل'
                            : 'Tap "Add" or "Install" to confirm'}
                        </span>
                      </li>
                    </ol>
                  </div>

                  {/* Benefits */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      {currentLanguage === "ar"
                        ? "فوائد التطبيق:"
                        : "App Benefits:"}
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        {currentLanguage === "ar"
                          ? "يعمل دون اتصال بالإنترنت"
                          : "Works offline"}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        {currentLanguage === "ar"
                          ? "محسن للاتصال المحدود"
                          : "Optimized for limited connectivity"}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                        {currentLanguage === "ar"
                          ? "إشعارات فورية للحالات الطارئة"
                          : "Instant notifications for emergencies"}
                      </li>
                    </ul>
                  </div>

                  {/* Demo Access */}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {currentLanguage === "ar"
                        ? "تريد تجربة المنصة أولاً؟"
                        : "Want to try the platform first?"}
                    </p>
                    <a
                      href="/demo/mobile"
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors mb-2"
                      onClick={onClose}
                    >
                      <DevicePhoneMobileIcon className="h-4 w-4" />
                      {currentLanguage === "ar"
                        ? "تجربة المنصة (بدون تحميل)"
                        : "Try Demo (No Install Required)"}
                    </a>
                    <div className="mt-2">
                      <a
                        href="mailto:support@jusur.org.uk"
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        {currentLanguage === "ar"
                          ? "اتصل بفريق الدعم"
                          : "Contact Support Team"}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
                    onClick={onClose}
                  >
                    {currentLanguage === "ar" ? "إغلاق" : "Close"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
                    onClick={() => {
                      // In a real implementation, this would trigger PWA install prompt
                      if ("serviceWorker" in navigator) {
                        // Trigger PWA install prompt
                        window.location.reload();
                      }
                      onClose();
                    }}
                  >
                    {currentLanguage === "ar"
                      ? "فهمت، دعني أحمل التطبيق"
                      : "Got it, let me install"}
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
