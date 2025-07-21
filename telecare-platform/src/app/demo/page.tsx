"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import EnhancedRegistrationModal from "@/components/EnhancedRegistrationModal";
import { UserIcon, HeartIcon, UserPlusIcon } from "@heroicons/react/24/outline";

export default function DemoPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [initialModalPage, setInitialModalPage] = useState<
    "choice" | "login" | "role"
  >("choice");

  const openRegistrationModal = () => {
    setInitialModalPage("choice");
    setRegistrationModalOpen(true);
  };

  const openLoginModal = () => {
    setInitialModalPage("login");
    setRegistrationModalOpen(true);
  };

  const openCreateAccountModal = () => {
    setInitialModalPage("role");
    setRegistrationModalOpen(true);
  };

  const closeRegistrationModal = () => {
    setRegistrationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <img
              src="/app-icon.png"
              alt="Jusur"
              className="w-16 h-16 object-cover rounded"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {language === "ar" ? "جسور" : "Jusur"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {language === "ar"
              ? "منصة طبية تربط الأطباء الفلسطينيين مع المتخصصين البريطانيين"
              : "Medical platform connecting Palestinian doctors with UK specialists"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={openLoginModal}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer flex items-center justify-center gap-2"
          >
            <UserIcon className="h-5 w-5" />
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </button>

          <button
            onClick={openCreateAccountModal}
            className="w-full bg-green-950 text-white py-3 px-4 rounded-lg hover:bg-green-900 transition-colors font-medium cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            {language === "ar" ? "إنشاء حساب جديد" : "Create New Account"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-zinc-900 text-gray-500 dark:text-gray-400">
                {language === "ar" ? "أو" : "or"}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/demo/mobile")}
            className="w-full bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
          >
            {language === "ar"
              ? "المتابعة بدون تسجيل دخول (عرض توضيحي)"
              : "Continue without login (Demo)"}
          </button>
        </div>

        <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          {language === "ar"
            ? "للحصول على أفضل تجربة، يُنصح بتسجيل الدخول للوصول إلى جميع الميزات"
            : "For the best experience, login is recommended to access all features"}
        </p>
      </div>

      {/* Enhanced Registration Modal */}
      <EnhancedRegistrationModal
        isOpen={registrationModalOpen}
        onClose={closeRegistrationModal}
        language={language}
        initialPage={initialModalPage}
      />
    </div>
  );
}
