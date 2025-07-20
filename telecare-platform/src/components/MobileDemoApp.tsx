"use client";

import React, { useState, useEffect } from "react";
import {
  UserIcon,
  CalendarIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  HeartIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  PaperAirplaneIcon,
  StarIcon,
  TrophyIcon,
  BoltIcon,
  FunnelIcon,
  EyeIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
  ExclamationCircleIcon,
  ChevronRightIcon,
  LanguageIcon,
  WifiIcon,
  NoSymbolIcon,
  PhotoIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "@/hooks/useLanguage";
import { dummyPublicUsers, getUserById, getAvailableSpecialists } from "@/data/dummyUsers";
import { dummyCases, dummyResponses, getCaseById, getResponsesByCase } from "@/data/dummyCases";
import type { PublicUserProfile, MedicalCase, CaseResponse } from "@/types";

export default function MobileDemoApp() {
  const { language } = useLanguage();
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "forum"
    | "emergency" 
    | "scheduled"
    | "profile"
    | "case-detail"
  >("dashboard");
  
  const [currentUserId, setCurrentUserId] = useState<string>("gaza_001");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  const currentUser = getUserById(currentUserId) || dummyPublicUsers[0];
  const currentUserType = currentUser.role;

  // Simulate offline status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOffline(prev => Math.random() < 0.1 ? !prev : prev);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const ViewSwitcher = () => (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 p-1">
      <div className="flex flex-col space-y-1">
        <button
          onClick={() => window.location.href = '/'}
          className="p-2 rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          title={language === "ar" ? "العودة للرئيسية" : "Back to Home"}
        >
          <HomeIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`p-2 rounded-md transition-colors ${
            viewMode === "mobile"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          }`}
          title={language === "ar" ? "عرض الهاتف" : "Mobile View"}
        >
          <DevicePhoneMobileIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("desktop")}
          className={`p-2 rounded-md transition-colors ${
            viewMode === "desktop"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          }`}
          title={language === "ar" ? "عرض سطح المكتب" : "Desktop View"}
        >
          <ComputerDesktopIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const Header = () => (
    <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center">
        {viewMode === "mobile" && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mr-3"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <HeartIcon className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-800 dark:text-white hidden sm:block">
            {language === "ar" ? "جسور" : "Jusur"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          {isOffline ? (
            <NoSymbolIcon className="h-4 w-4 text-red-500" />
          ) : (
            <WifiIcon className="h-4 w-4 text-green-500" />
          )}
          <span className="text-xs text-gray-600 dark:text-gray-300 hidden sm:block">
            {isOffline 
              ? (language === "ar" ? "غير متصل" : "Offline")
              : (language === "ar" ? "متصل" : "Online")
            }
          </span>
        </div>

        <div className="relative">
          <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <UserIcon className="h-4 w-4" />
        </div>
      </div>
    </header>
  );

  const SidebarNav = () => (
    <div
      className={`${
        viewMode === "desktop"
          ? "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white"
          : `fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <HeartIcon className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold">
            {language === "ar" ? "جسور" : "Jusur"}
          </h1>
        </div>
        {viewMode === "mobile" && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-blue-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className={viewMode === "desktop" ? "mt-8" : "mt-8"}>
        <NavItem icon={<ChartBarIcon className="h-5 w-5" />} label={language === "ar" ? "لوحة التحكم" : "Dashboard"} view="dashboard" />
        <NavItem icon={<ChatBubbleOvalLeftIcon className="h-5 w-5" />} label={language === "ar" ? "المنتدى الطبي" : "Medical Forum"} view="forum" />
        {currentUserType === "gaza_clinician" && (
          <NavItem icon={<BoltIcon className="h-5 w-5" />} label={language === "ar" ? "استشارة طارئة" : "Emergency Consult"} view="emergency" />
        )}
        <NavItem icon={<CalendarIcon className="h-5 w-5" />} label={language === "ar" ? "الاجتماعات المجدولة" : "Scheduled MDTs"} view="scheduled" />
        <NavItem icon={<UserIcon className="h-5 w-5" />} label={language === "ar" ? "الملف الشخصي" : "Profile"} view="profile" />
      </nav>

      {/* User Type Switcher (Demo only) */}
      <div className={`absolute ${viewMode === "desktop" ? "bottom-20" : "bottom-20"} left-0 right-0 px-4`}>
        <div className="bg-blue-700 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-200 mb-2">
            {language === "ar" ? "تجريبي: تبديل نوع المستخدم" : "Demo: Switch User Type"}
          </p>
          <select
            value={currentUserId}
            onChange={(e) => setCurrentUserId(e.target.value)}
            className="w-full bg-blue-600 text-white border border-blue-500 rounded px-2 py-1 text-sm"
          >
            <optgroup label={language === "ar" ? "أطباء غزة" : "Gaza Clinicians"}>
              {dummyPublicUsers.filter(u => u.role === "gaza_clinician").map(user => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
                </option>
              ))}
            </optgroup>
            <optgroup label={language === "ar" ? "أخصائيو بريطانيا" : "UK Specialists"}>
              {dummyPublicUsers.filter(u => u.role === "uk_specialist").map(user => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
                </option>
              ))}
            </optgroup>
            <optgroup label={language === "ar" ? "المدراء" : "Admins"}>
              {dummyPublicUsers.filter(u => u.role === "admin").map(user => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center relative">
            <UserIcon className="h-4 w-4" />
            <CheckCircleIcon className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400 bg-blue-800 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.displayName}</p>
            <p className="text-xs text-blue-200 truncate">
              {currentUser.specialties?.[0] || currentUser.role}
              {currentUser.points && ` • ${currentUser.points} pts`}
            </p>
            {currentUser.availabilityStatus && currentUser.role === "uk_specialist" && (
              <div className="flex items-center mt-1">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${
                    currentUser.availabilityStatus === "available"
                      ? "bg-green-400"
                      : currentUser.availabilityStatus === "busy"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs text-blue-200 capitalize">
                  {language === "ar" 
                    ? (currentUser.availabilityStatus === "available" ? "متاح" : 
                       currentUser.availabilityStatus === "busy" ? "مشغول" : "غير متصل")
                    : currentUser.availabilityStatus
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const MobileBottomNav = () => (
    <div className="fixed bottom-0 z-40">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 px-4 py-2">
        <div className="flex justify-around">
          <BottomNavItem
            icon={<ChartBarIcon className="h-5 w-5" />}
            label={language === "ar" ? "لوحة" : "Dashboard"}
            view="dashboard"
            isActive={activeView === "dashboard"}
          />
          <BottomNavItem
            icon={<ChatBubbleOvalLeftIcon className="h-5 w-5" />}
            label={language === "ar" ? "منتدى" : "Forum"}
            view="forum"
            isActive={activeView === "forum"}
          />
          {currentUserType === "gaza_clinician" && (
            <BottomNavItem
              icon={<BoltIcon className="h-5 w-5" />}
              label={language === "ar" ? "طارئ" : "Emergency"}
              view="emergency"
              isActive={activeView === "emergency"}
            />
          )}
          <BottomNavItem
            icon={<CalendarIcon className="h-5 w-5" />}
            label={language === "ar" ? "مجدول" : "Scheduled"}
            view="scheduled"
            isActive={activeView === "scheduled"}
          />
          <BottomNavItem
            icon={<UserIcon className="h-5 w-5" />}
            label={language === "ar" ? "ملف" : "Profile"}
            view="profile"
            isActive={activeView === "profile"}
          />
        </div>
      </div>
    </div>
  );

  const BottomNavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    view: string;
    isActive: boolean;
  }> = ({ icon, label, view, isActive }) => (
    <button
      onClick={() => setActiveView(view as any)}
      className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium truncate">{label}</span>
    </button>
  );

  const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    view: string;
  }> = ({ icon, label, view }) => (
    <button
      onClick={() => {
        setActiveView(view as any);
        setSidebarOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-left hover:bg-blue-800 transition-colors ${
        activeView === view ? "bg-blue-800 border-r-4 border-blue-300" : ""
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  const Dashboard = () => (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">
          {language === "ar" ? "مرحباً، " : "Welcome, "}
          {currentUser.displayName}
        </h2>
        <p className="text-blue-100 mb-4">
          {currentUserType === "gaza_clinician"
            ? language === "ar"
              ? "احصل على استشارات طبية من أطباء متخصصين في المملكة المتحدة"
              : "Connect with UK specialists for medical consultations"
            : language === "ar"
            ? "ساعد الأطباء في غزة بخبرتك الطبية"
            : "Help Gaza clinicians with your medical expertise"}
        </p>
        {currentUserType === "gaza_clinician" && (
          <button
            onClick={() => setActiveView("emergency")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            {language === "ar"
              ? "طلب استشارة طارئة"
              : "Request Emergency Consultation"}
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className={`grid gap-4 ${
        viewMode === "mobile" ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
      }`}>
        <StatsCard
          icon={<ChatBubbleOvalLeftIcon className="h-5 w-5" />}
          title={language === "ar" ? "الحالات النشطة" : "Active Cases"}
          value="12"
          change="+3"
          color="blue"
        />
        <StatsCard
          icon={<UsersIcon className="h-5 w-5" />}
          title={language === "ar" ? "المتخصصون المتاحون" : "Available Specialists"}
          value={getAvailableSpecialists().length.toString()}
          change="+2"
          color="green"
        />
        <StatsCard
          icon={<ClockIcon className="h-5 w-5" />}
          title={language === "ar" ? "متوسط وقت الاستجابة" : "Avg Response Time"}
          value="15m"
          change="-5m"
          color="purple"
        />
        <StatsCard
          icon={<CheckCircleIcon className="h-5 w-5" />}
          title={language === "ar" ? "الحالات المحلولة" : "Cases Resolved"}
          value="156"
          change="+12"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">
            {language === "ar" ? "النشاطات الأخيرة" : "Recent Activity"}
          </h3>
          <button
            onClick={() => setActiveView("forum")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {language === "ar" ? "عرض الكل" : "View All"}
          </button>
        </div>
        <div className="space-y-3">
          {dummyCases.slice(0, 3).map((case_) => (
            <CaseCard key={case_.id} case_={case_} compact={true} />
          ))}
        </div>
      </div>
    </div>
  );

  const StatsCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    color: string;
  }> = ({ icon, title, value, change, color }) => {
    const colorClasses = {
      blue: "text-blue-600 bg-blue-100 dark:bg-blue-950",
      green: "text-green-600 bg-green-100 dark:bg-green-950",
      purple: "text-purple-600 bg-purple-100 dark:bg-purple-950",
      red: "text-red-600 bg-red-100 dark:bg-red-950",
    };

    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`p-2 rounded-lg ${
              colorClasses[color as keyof typeof colorClasses]
            }`}
          >
            {icon}
          </div>
          <span
            className={`text-xs font-medium ${
              change.startsWith("+")
                ? "text-green-600"
                : change.startsWith("-")
                ? "text-red-600"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {change}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold dark:text-white">{value}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{title}</p>
        </div>
      </div>
    );
  };

  const CaseCard: React.FC<{
    case_: MedicalCase;
    compact?: boolean;
    onClick?: () => void;
  }> = ({ case_, compact = false, onClick }) => {
    const urgencyColors = {
      low: "text-green-600 bg-green-100 dark:bg-green-950",
      medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
      high: "text-orange-600 bg-orange-100 dark:bg-orange-950",
      critical: "text-red-600 bg-red-100 dark:bg-red-950",
    };

    const statusColors = {
      open: "text-blue-600 bg-blue-100 dark:bg-blue-950",
      in_progress: "text-purple-600 bg-purple-100 dark:bg-purple-950",
      resolved: "text-green-600 bg-green-100 dark:bg-green-950",
      closed: "text-gray-600 bg-gray-100 dark:bg-gray-950",
    };

    const creator = getUserById(case_.createdBy);

    return (
      <div
        className={`bg-white dark:bg-zinc-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-zinc-700 ${
          onClick ? "cursor-pointer" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  urgencyColors[case_.urgency]
                }`}
              >
                {language === "ar" 
                  ? (case_.urgency === "critical" ? "حرجة" : 
                     case_.urgency === "high" ? "عالية" :
                     case_.urgency === "medium" ? "متوسطة" : "منخفضة")
                  : case_.urgency
                }
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[case_.status]
                }`}
              >
                {language === "ar"
                  ? (case_.status === "open" ? "مفتوحة" :
                     case_.status === "in_progress" ? "قيد المعالجة" :
                     case_.status === "resolved" ? "محلولة" : "مغلقة")
                  : case_.status.replace("_", " ")
                }
              </span>
              {case_.images && case_.images.length > 0 && (
                <PhotoIcon className="h-3.5 w-3.5 text-gray-400" />
              )}
              {case_.requiresTranslation && (
                <LanguageIcon className="h-3.5 w-3.5 text-blue-500" />
              )}
            </div>
            <h3
              className={`font-semibold dark:text-white ${
                compact ? "text-sm" : "text-base"
              } mb-1`}
            >
              {case_.title}
            </h3>
            {!compact && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                {case_.description}
              </p>
            )}
          </div>
          {onClick && <ChevronRightIcon className="h-5 w-5 text-gray-400" />}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-4">
            <span>{creator?.displayName}</span>
            <span>•</span>
            <span>{case_.specialty}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
            {case_.responseCount && case_.responseCount > 0 && (
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                <span>{case_.responseCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ForumView = () => (
    <div className="p-4 space-y-4">
      {/* Header with Post Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-white">
          {language === "ar" ? "المنتدى الطبي" : "Medical Forum"}
        </h2>
        {currentUserType === "gaza_clinician" && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>{language === "ar" ? "إضافة حالة" : "Post Case"}</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={language === "ar" ? "الكل" : "All"}
            active={true}
          />
          <FilterChip label={language === "ar" ? "قلبية" : "Cardiology"} />
          <FilterChip label={language === "ar" ? "أطفال" : "Pediatrics"} />
          <FilterChip label={language === "ar" ? "جراحة" : "Surgery"} />
          <FilterChip label={language === "ar" ? "طارئة" : "Emergency"} />
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {dummyCases.map((case_) => (
          <CaseCard
            key={case_.id}
            case_={case_}
            onClick={() => {
              setSelectedCase(case_);
              setActiveView("case-detail");
            }}
          />
        ))}
      </div>
    </div>
  );

  const FilterChip: React.FC<{ label: string; active?: boolean }> = ({
    label,
    active = false,
  }) => (
    <button
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
      }`}
    >
      {label}
    </button>
  );

  const CaseDetailView = () => {
    if (!selectedCase) {
      return (
        <div className="p-4">
          <h2 className="text-xl font-bold dark:text-white mb-4">
            {language === "ar" ? "تفاصيل الحالة" : "Case Details"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {language === "ar" ? "لم يتم اختيار حالة" : "No case selected"}
          </p>
        </div>
      );
    }

    const creator = getUserById(selectedCase.createdBy);
    const responses = getResponsesByCase(selectedCase.id);
    const [newResponse, setNewResponse] = useState("");
    const [showResponseForm, setShowResponseForm] = useState(false);

    const urgencyColors = {
      low: "text-green-600 bg-green-100 dark:bg-green-950",
      medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
      high: "text-orange-600 bg-orange-100 dark:bg-orange-950",
      critical: "text-red-600 bg-red-100 dark:bg-red-950",
    };

    const statusColors = {
      open: "text-blue-600 bg-blue-100 dark:bg-blue-950",
      in_progress: "text-purple-600 bg-purple-100 dark:bg-purple-950",
      resolved: "text-green-600 bg-green-100 dark:bg-green-950",
      closed: "text-gray-600 bg-gray-100 dark:bg-gray-950",
    };

    return (
      <div className="p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView("forum")}
            className="text-blue-600 hover:text-blue-800 p-2 -ml-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <ChevronRightIcon className="h-5 w-5 rotate-180" />
          </button>
          <h1 className="text-xl font-bold dark:text-white flex-1">
            {language === "ar" ? "تفاصيل الحالة" : "Case Details"}
          </h1>
        </div>

        {/* Case Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                urgencyColors[selectedCase.urgency]
              }`}
            >
              {language === "ar" 
                ? (selectedCase.urgency === "critical" ? "حرجة" : 
                   selectedCase.urgency === "high" ? "عالية" :
                   selectedCase.urgency === "medium" ? "متوسطة" : "منخفضة")
                : selectedCase.urgency
              }
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[selectedCase.status]
              }`}
            >
              {language === "ar"
                ? (selectedCase.status === "open" ? "مفتوحة" :
                   selectedCase.status === "in_progress" ? "قيد المعالجة" :
                   selectedCase.status === "resolved" ? "محلولة" : "مغلقة")
                : selectedCase.status.replace("_", " ")
              }
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
              {selectedCase.specialty}
            </span>
          </div>

          <h2 className="text-xl font-bold dark:text-white mb-2">
            {selectedCase.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedCase.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span>{creator?.displayName}</span>
              <span>•</span>
              <span>{new Date(selectedCase.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-3.5 w-3.5" />
              <span>{selectedCase.viewCount}</span>
              <HandThumbUpIcon className="h-3.5 w-3.5 ml-2" />
              <span>{selectedCase.likeCount}</span>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        {selectedCase.vitalSigns && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              {language === "ar" ? "المعلومات الحيوية" : "Vital Signs"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedCase.vitalSigns.temperature && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === "ar" ? "درجة الحرارة" : "Temperature"}
                  </p>
                  <p className="font-medium dark:text-white">
                    {selectedCase.vitalSigns.temperature}°C
                  </p>
                </div>
              )}
              {selectedCase.vitalSigns.heartRate && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === "ar" ? "النبض" : "Heart Rate"}
                  </p>
                  <p className="font-medium dark:text-white">
                    {selectedCase.vitalSigns.heartRate} bpm
                  </p>
                </div>
              )}
              {selectedCase.vitalSigns.bloodPressure && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === "ar" ? "ضغط الدم" : "Blood Pressure"}
                  </p>
                  <p className="font-medium dark:text-white">
                    {selectedCase.vitalSigns.bloodPressure.systolic}/
                    {selectedCase.vitalSigns.bloodPressure.diastolic}
                  </p>
                </div>
              )}
              {selectedCase.vitalSigns.oxygenSaturation && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === "ar" ? "الأكسجين" : "O2 Saturation"}
                  </p>
                  <p className="font-medium dark:text-white">
                    {selectedCase.vitalSigns.oxygenSaturation}%
                  </p>
                </div>
              )}
              {selectedCase.vitalSigns.painScale && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {language === "ar" ? "مقياس الألم" : "Pain Scale"}
                  </p>
                  <p className="font-medium dark:text-white">
                    {selectedCase.vitalSigns.painScale}/10
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Results */}
        {selectedCase.testResults && selectedCase.testResults.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              {language === "ar" ? "نتائج الفحوصات" : "Test Results"}
            </h3>
            <div className="space-y-3">
              {selectedCase.testResults.map((test) => (
                <div key={test.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium dark:text-white">{test.testName}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.status === "critical"
                          ? "bg-red-100 text-red-600 dark:bg-red-950"
                          : test.status === "abnormal"
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-950"
                          : "bg-green-100 text-green-600 dark:bg-green-950"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <strong>{language === "ar" ? "النتيجة:" : "Result:"}</strong> {test.result}
                    {test.unit && ` ${test.unit}`}
                  </p>
                  {test.normalRange && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <strong>{language === "ar" ? "المعدل الطبيعي:" : "Normal Range:"}</strong> {test.normalRange}
                    </p>
                  )}
                  {test.interpretation && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>{language === "ar" ? "التفسير:" : "Interpretation:"}</strong> {test.interpretation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responses */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold dark:text-white">
              {language === "ar" ? "الاستشارات" : "Consultations"} ({responses.length})
            </h3>
            {currentUserType === "uk_specialist" && (
              <button
                onClick={() => setShowResponseForm(!showResponseForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{language === "ar" ? "إضافة استشارة" : "Add Response"}</span>
              </button>
            )}
          </div>

          {/* Response Form */}
          {showResponseForm && (
            <div className="mb-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder={language === "ar" ? "اكتب استشارتك هنا..." : "Write your consultation here..."}
                className="w-full h-32 p-3 border border-gray-300 dark:border-zinc-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
              />
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => setShowResponseForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={() => {
                    // In a real app, this would submit the response
                    setNewResponse("");
                    setShowResponseForm(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>{language === "ar" ? "إرسال" : "Submit"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Responses List */}
          <div className="space-y-4">
            {responses.map((response) => {
              const responder = getUserById(response.createdBy);
              return (
                <div key={response.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {responder?.displayName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {responder?.specialties?.[0]} • {new Date(response.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {response.isPrimaryConsultation && (
                      <span className="bg-green-100 text-green-600 dark:bg-green-950 px-2 py-1 rounded-full text-xs font-medium">
                        {language === "ar" ? "استشارة أولية" : "Primary"}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {response.content}
                  </p>
                  
                  {response.diagnosis && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {language === "ar" ? "التشخيص:" : "Diagnosis:"}
                      </span>
                      <span className="ml-2 text-sm dark:text-white">{response.diagnosis}</span>
                    </div>
                  )}
                  
                  {response.treatmentRecommendation && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {language === "ar" ? "العلاج المقترح:" : "Treatment:"}
                      </span>
                      <span className="ml-2 text-sm dark:text-white">{response.treatmentRecommendation}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        <HandThumbUpIcon className="h-3.5 w-3.5" />
                        <span className="text-sm">{response.likeCount}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                        <StarIcon className="h-3.5 w-3.5" />
                        <span className="text-sm">{response.thanksCount}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>{language === "ar" ? "مفيدة" : "Helpful"}: {response.helpfulnessRating}/5</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "forum":
        return <ForumView />;
      case "emergency":
        return <div className="p-4"><h2 className="text-xl font-bold dark:text-white">{language === "ar" ? "الاستشارات الطارئة" : "Emergency Consultations"}</h2><p className="text-gray-600 dark:text-gray-300 mt-2">{language === "ar" ? "قريباً..." : "Coming soon..."}</p></div>;
      case "scheduled":
        return <div className="p-4"><h2 className="text-xl font-bold dark:text-white">{language === "ar" ? "الاجتماعات المجدولة" : "Scheduled MDTs"}</h2><p className="text-gray-600 dark:text-gray-300 mt-2">{language === "ar" ? "قريباً..." : "Coming soon..."}</p></div>;
      case "profile":
        return <div className="p-4"><h2 className="text-xl font-bold dark:text-white">{language === "ar" ? "الملف الشخصي" : "Profile"}</h2><p className="text-gray-600 dark:text-gray-300 mt-2">{language === "ar" ? "قريباً..." : "Coming soon..."}</p></div>;
      case "case-detail":
        return <CaseDetailView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-zinc-950 ${
      viewMode === "desktop" ? "flex" : ""
    }`}>
      <ViewSwitcher />
      
      {viewMode === "desktop" && <SidebarNav />}
      
      <div className={`flex-1 flex flex-col ${
        viewMode === "desktop" ? "ml-64" : ""
      }`}>
        {/* Container with responsive width */}
        <div className={`w-full ${
          viewMode === "mobile" ? "max-w-md mx-auto" : "max-w-none"
        }`}>
          <Header />
          <main className={`flex-1 overflow-auto ${
            viewMode === "mobile" ? "pb-20" : ""
          }`}>
            {renderContent()}
          </main>
          
          {viewMode === "mobile" && <MobileBottomNav />}
        </div>
      </div>
      
      {viewMode === "mobile" && <SidebarNav />}

      {/* Offline Banner */}
      {isOffline && (
        <div className={`fixed ${viewMode === "mobile" ? "bottom-24" : "bottom-4"} bg-yellow-100 border border-yellow-300 rounded-lg p-2 flex items-center space-x-2 z-50 ${
          viewMode === "desktop" 
            ? "left-68 right-4" 
            : viewMode === "mobile"
            ? "left-4 right-20"
            : "left-4 right-4"
        }`}>
          <NoSymbolIcon className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-800 text-sm">
            {language === "ar"
              ? "عمل بدون اتصال"
              : "Working offline"}
          </span>
        </div>
      )}
    </div>
  );
}