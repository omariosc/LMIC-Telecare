"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  UserIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon,
  XMarkIcon,
  PlusIcon,
  PaperAirplaneIcon,
  StarIcon,
  BoltIcon,
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
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  HomeIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "@/hooks/useLanguage";
import {
  dummyPublicUsers,
  getUserById,
  getAvailableSpecialists,
} from "@/data/dummyUsers";
import { dummyCases } from "@/data/dummyCases";
import type { MedicalCase, CaseResponse, User } from "@/types";
import EnhancedRegistrationModal from "./EnhancedRegistrationModal";
import AdminRegistrationModal from "./AdminRegistrationModal";
import { uploadToCloudflare } from "@/utils/imageUpload";

// Dummy data for pending registrations
const dummyPendingRegistrations: Array<Partial<User> & { id: string }> = [
  {
    id: "pending_001",
    firstName: "Omar",
    lastName: "Al-Rashid",
    email: "omar.rashid@gmail.com",
    role: "uk_specialist",
    specialties: ["cardiology", "internal_medicine"],
    gmcNumber: "7789012",
    institution: "Manchester Royal Infirmary",
    yearsOfExperience: 12,
    status: "pending",
    createdAt: "2025-01-18T10:30:00Z",
  },
  {
    id: "pending_002",
    firstName: "Aisha",
    lastName: "Khan",
    email: "aisha.khan@nhs.uk",
    role: "uk_specialist",
    specialties: ["pediatrics", "emergency_medicine"],
    gmcNumber: "7890123",
    institution: "Birmingham Children's Hospital",
    yearsOfExperience: 8,
    status: "pending",
    createdAt: "2025-01-19T14:15:00Z",
  },
  {
    id: "pending_003",
    firstName: "Khalil",
    lastName: "Mansour",
    email: "k.mansour@gaza-med.ps",
    role: "gaza_clinician",
    specialties: ["surgery", "trauma"],
    institution: "Gaza European Hospital",
    yearsOfExperience: 6,
    status: "pending",
    referralCode: "REF123",
    createdAt: "2025-01-20T09:00:00Z",
  },
];

// Dummy data for reviewed registrations
const dummyReviewedRegistrations: Array<
  Partial<User> & {
    id: string;
    reviewedAt: string;
    reviewedBy: string;
    decision: "approved" | "rejected";
    reviewNotes?: string;
  }
> = [
  {
    id: "reviewed_001",
    firstName: "Sarah",
    lastName: "Ahmed",
    email: "sarah.ahmed@nhs.uk",
    role: "uk_specialist",
    specialties: ["neurology", "stroke_care"],
    gmcNumber: "7567890",
    institution: "St. Bartholomew's Hospital",
    yearsOfExperience: 15,
    status: "verified",
    createdAt: "2025-01-15T09:20:00Z",
    reviewedAt: "2025-01-16T14:30:00Z",
    reviewedBy: "admin_001",
    decision: "approved",
    reviewNotes: "Excellent credentials and clear specialization",
  },
  {
    id: "reviewed_002",
    firstName: "David",
    lastName: "Thompson",
    email: "d.thompson@gmail.com",
    role: "uk_specialist",
    specialties: ["general_medicine"],
    gmcNumber: "7123459",
    institution: "Private Practice",
    yearsOfExperience: 3,
    status: "suspended",
    createdAt: "2025-01-17T11:45:00Z",
    reviewedAt: "2025-01-18T10:15:00Z",
    reviewedBy: "admin_001",
    decision: "rejected",
    reviewNotes: "Insufficient experience and unclear credentials",
  },
];

// Dummy data for incidents
const dummyIncidents = [
  {
    id: "incident_001",
    caseId: "case_001",
    caseTitle: "Urgent pediatric consultation needed",
    reportedBy: "uk_002",
    reportReason: "Inappropriate content in case description",
    reportDetails:
      "Case contains non-medical content that violates platform guidelines",
    status: "pending",
    createdAt: "2025-01-19T16:30:00Z",
    reportedUser: "gaza_002",
  },
  {
    id: "incident_002",
    caseId: "case_005",
    caseTitle: "Post-surgical complications advice",
    reportedBy: "gaza_001",
    reportReason: "Spam or duplicate posting",
    reportDetails:
      "User has posted the same case multiple times with different details",
    status: "pending",
    createdAt: "2025-01-20T11:45:00Z",
    reportedUser: "uk_004",
  },
];

export default function MobileDemoApp() {
  const { language, toggleLanguage } = useLanguage();

  // Prevent hydration mismatch by not rendering until client is ready
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "forum"
    | "emergency"
    | "scheduled"
    | "profile"
    | "case-detail"
    | "registration-requests"
    | "incidents"
  >("dashboard");

  const [currentUserId, setCurrentUserId] = useState<string>("gaza_001");

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  // Registration state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Set default view for admin users
  React.useEffect(() => {
    const currentUser = getUserById(currentUserId);
    if (currentUser?.role === "admin" && activeView === "dashboard") {
      setActiveView("registration-requests");
    } else if (
      currentUser?.role !== "admin" &&
      (activeView === "registration-requests" || activeView === "incidents")
    ) {
      setActiveView("dashboard");
    }
  }, [currentUserId, activeView]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [_notifications] = useState(3);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [showResolvedCases, setShowResolvedCases] = useState(false);
  const [activeSpecialtyFilter, setActiveSpecialtyFilter] =
    useState<string>("all");

  // Registration requests state management - hydration safe
  const [pendingRequests, setPendingRequests] = useState(
    dummyPendingRegistrations
  );
  const [reviewedRequests, setReviewedRequests] = useState(
    dummyReviewedRegistrations
  );
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    setIsClient(true);

    const savedPending = localStorage.getItem("pendingRegistrations");
    if (savedPending) {
      try {
        setPendingRequests(JSON.parse(savedPending));
      } catch (error) {
        console.warn("Error loading pending registrations:", error);
      }
    }

    const savedReviewed = localStorage.getItem("reviewedRegistrations");
    if (savedReviewed) {
      try {
        setReviewedRequests(JSON.parse(savedReviewed));
      } catch (error) {
        console.warn("Error loading reviewed registrations:", error);
      }
    }
  }, []);

  // Incidents state management (no localStorage needed, just remove from screen)
  const [incidents, setIncidents] = useState(dummyIncidents);

  // Cases state management for runtime storage (no persistence)
  const [cases, setCases] = useState<MedicalCase[]>(dummyCases);

  // Case creation form state
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  const [newCaseSpecialty, setNewCaseSpecialty] = useState("general_medicine");
  const [newCaseUrgency, setNewCaseUrgency] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");
  const [newCaseImages, setNewCaseImages] = useState<string[]>([]);
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState<
    "male" | "female" | "other"
  >("male");
  const [testResults, setTestResults] = useState<
    { testName: string; result: string }[]
  >([]);
  const [newTestName, setNewTestName] = useState("");
  const [newTestResult, setNewTestResult] = useState("");
  const [caseLikes, setCaseLikes] = useState<
    Record<string, { likes: number; userLiked: boolean }>
  >({});
  const [_aiSummaryLikes] = useState<Record<string, { liked: boolean }>>({});
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});

  const currentUser = getUserById(currentUserId) || dummyPublicUsers[0];
  const currentUserType = currentUser.role;

  // Helper functions for registration request management

  // Helper functions for incident management
  const handleIgnoreIncident = (incidentId: string) => {
    setIncidents(incidents.filter((incident) => incident.id !== incidentId));
  };

  const handleBanUser = (incidentId: string) => {
    setIncidents(incidents.filter((incident) => incident.id !== incidentId));
  };

  // Login functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@jusur.com" && password === "Developers") {
      setIsLoggedIn(true);
      setCurrentUserId("admin_001");
      setActiveView("registration-requests");
      setViewMode("mobile");
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Incorrect email or password");
    }
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
    setLoginError("");
    setShowForgotPassword(false);
    // Clear form fields for clean UX
    setEmail("");
    setPassword("");
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
  };

  // Forgot password functions
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordMessage("");

    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      setForgotPasswordMessage("Please enter a valid email address");
      return;
    }

    try {
      // For demo purposes, we'll send the default password
      const currentPassword = "Developers"; // In production, this would be retrieved from database

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "forgot_password",
          email: forgotPasswordEmail,
          password: currentPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send password recovery email");
      }

      setForgotPasswordMessage("Password sent to your email address");
    } catch (error) {
      console.error("Failed to send password recovery email:", error);
      setForgotPasswordMessage("Failed to send password recovery email");
    }
  };

  const handleStartNoLogin = () => {
    setIsLoggedIn(true);
    // Keep default user and view
  };

  // Auto-login for direct access to /app route
  useEffect(() => {
    if (isClientReady && !isLoggedIn) {
      handleStartNoLogin();
    }
  }, [isClientReady, isLoggedIn]);

  // Registration functions
  const handleShowRegistration = () => {
    setShowRegistrationModal(true);
    setLoginError(""); // Clear any existing login errors when switching to registration
  };

  // Simulate offline status changes - only on client after hydration
  useEffect(() => {
    if (!isClient) return;

    // Add a delay to ensure hydration is complete
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setIsOffline((prev) => (Math.random() < 0.1 ? !prev : prev));
      }, 30000);
      return () => clearInterval(interval);
    }, 2000); // Start after 2 seconds

    return () => clearTimeout(timeout);
  }, [isClient]);

  const ViewSwitcher = () => (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 p-1">
      <div className="flex flex-col space-y-1">
        <button
          onClick={() => (window.location.href = "/")}
          className="p-2 rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
          title={language === "ar" ? "العودة للرئيسية" : "Back to Home"}
        >
          <HomeIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("mobile")}
          className={`p-2 rounded-md transition-colors cursor-pointer ${
            viewMode === "mobile"
              ? "bg-green-950 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          }`}
          title={language === "ar" ? "عرض الهاتف" : "Mobile View"}
        >
          <DevicePhoneMobileIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode("desktop")}
          className={`p-2 rounded-md transition-colors cursor-pointer ${
            viewMode === "desktop"
              ? "bg-green-950 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
          }`}
          title={language === "ar" ? "عرض سطح المكتب" : "Desktop View"}
        >
          <ComputerDesktopIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const Header = () => {
    const getPageTitle = () => {
      switch (activeView) {
        case "dashboard":
          return language === "ar" ? "لوحة التحكم" : "Dashboard";
        case "forum":
          return language === "ar" ? "المنتدى الطبي" : "Medical Forum";
        case "emergency":
          return language === "ar" ? "طارئ" : "Emergency";
        case "scheduled":
          return language === "ar" ? "MDT" : "MDT";
        case "profile":
          return language === "ar" ? "الملف الشخصي" : "Profile";
        case "case-detail":
          return language === "ar" ? "تفاصيل الحالة" : "Case Details";
        case "registration-requests":
          return language === "ar" ? "طلبات التسجيل" : "Registration Requests";
        case "incidents":
          return language === "ar" ? "الحوادث" : "Incidents";
        default:
          return language === "ar" ? "لوحة التحكم" : "Dashboard";
      }
    };

    return (
      <header
        className={`${
          viewMode === "desktop" ? "bg-green-950" : "bg-white dark:bg-zinc-900"
        } shadow-sm border-b border-gray-200 dark:border-zinc-700 h-16 flex items-center justify-between px-4 sticky top-0 z-40`}
      >
        <div className="flex items-center">
          {viewMode === "mobile" && (
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/app-icon.png"
                  alt="Jusur"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-gray-800 dark:text-white hidden sm:block">
                {language === "ar" ? "جسور" : "Jusur"}
              </span>
              {/* Show page title on mobile for all tabs */}
              {getPageTitle() && (
                <span className="font-bold text-gray-800 dark:text-white text-lg ml-2">
                  {getPageTitle()}
                </span>
              )}
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {isOffline ? (
              <NoSymbolIcon className="h-4 w-4 text-red-500" />
            ) : (
              <WifiIcon className="h-4 w-4 text-green-500" />
            )}
            <span
              className={`text-xs ${isOffline ? "text-red-500 dark:text-red-500" : "text-green-500 dark:text-green-500"}`}
            >
              {isOffline
                ? language === "ar"
                  ? "غير متصل"
                  : "Offline"
                : language === "ar"
                  ? "متصل"
                  : "Online"}
            </span>
          </div>

          {currentUserType !== "admin" && (
            // <div className="relative">
            //   <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer" />
            //   {notifications > 0 && (
            //     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            //       {notifications}
            //     </span>
            //   )}
            // </div>
            <></>
          )}
        </div>
      </header>
    );
  };

  const SidebarNav = () => (
    <div
      className={
        `${
          viewMode === "desktop"
            ? "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-green-900 to-green-950 text-white"
            : "fixed top-0 bottom-20 z-50 w-64 bg-gradient-to-b from-green-900 to-green-950 text-white transition-all duration-300 ease-in-out"
        }
      ` + (!sidebarOpen && viewMode === "mobile" ? "hidden" : "")
      }
      style={
        viewMode === "mobile"
          ? {
              left: sidebarOpen ? "calc(50vw - 192px)" : "calc(50vw - 448px)",
            }
          : {}
      }
    >
      <div className="flex items-center justify-between h-16 px-4 bg-green-950">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <Image
              src="/app-icon.png"
              alt="Jusur"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-lg font-bold">
            {language === "ar" ? "جسور" : "Jusur"}
          </h1>
        </button>
        {viewMode === "mobile" && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-green-200 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="mt-4">
        {currentUserType === "admin" ? (
          <>
            <NavItem
              icon={<UsersIcon className="h-5 w-5" />}
              label={
                language === "ar" ? "طلبات التسجيل" : "Registration Requests"
              }
              view="registration-requests"
            />
            <NavItem
              icon={<ExclamationTriangleIcon className="h-5 w-5" />}
              label={language === "ar" ? "الحوادث" : "Incidents"}
              view="incidents"
            />
            <NavItem
              icon={<UserIcon className="h-5 w-5" />}
              label={language === "ar" ? "الملف الشخصي" : "Profile"}
              view="profile"
            />
          </>
        ) : (
          <>
            <NavItem
              icon={<ChartBarIcon className="h-5 w-5" />}
              label={language === "ar" ? "لوحة التحكم" : "Dashboard"}
              view="dashboard"
            />
            <NavItem
              icon={<ChatBubbleOvalLeftIcon className="h-5 w-5" />}
              label={language === "ar" ? "المنتدى الطبي" : "Medical Forum"}
              view="forum"
            />
            <NavItem
              icon={<BoltIcon className="h-5 w-5" />}
              label={language === "ar" ? "استشارة طارئة" : "Emergency Consult"}
              view="emergency"
              disabled={true}
            />
            <NavItem
              icon={<UsersIcon className="h-5 w-5" />}
              label={language === "ar" ? "MDT" : "MDT"}
              view="scheduled"
              disabled={true}
            />
            <NavItem
              icon={<UserIcon className="h-5 w-5" />}
              label={language === "ar" ? "الملف الشخصي" : "Profile"}
              view="profile"
            />
          </>
        )}
      </nav>
    </div>
  );

  const MobileBottomNav = () => {
    if (currentUserType === "admin") {
      return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <div className="w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 px-4 py-3">
            <div className="flex justify-between max-w-sm mx-auto">
              <BottomNavItem
                icon={<UsersIcon className="h-5 w-5" />}
                label={language === "ar" ? "طلبات" : "Requests"}
                view="registration-requests"
                isActive={activeView === "registration-requests"}
                badgeCount={pendingRequests.length}
              />
              <BottomNavItem
                icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                label={language === "ar" ? "حوادث" : "Incidents"}
                view="incidents"
                isActive={activeView === "incidents"}
                badgeCount={incidents.length}
              />
              <BottomNavItem
                icon={<UserIcon className="h-5 w-5" />}
                label={language === "ar" ? "الملف الشخصي" : "Profile"}
                view="profile"
                isActive={activeView === "profile"}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 px-4 py-3">
          <div className="flex justify-between max-w-sm mx-auto px-4">
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
            <BottomNavItem
              icon={<BoltIcon className="h-5 w-5" />}
              label={language === "ar" ? "طارئ" : "Emergency"}
              view="emergency"
              isActive={activeView === "emergency"}
              disabled={true}
            />
            <BottomNavItem
              icon={<UsersIcon className="h-5 w-5" />}
              label={language === "ar" ? "MDT" : "MDT"}
              view="scheduled"
              isActive={activeView === "scheduled"}
              disabled={true}
            />
            {/* Show Profile tab for all user types */}
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
  };

  const BottomNavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    view?: string;
    isActive?: boolean;
    disabled?: boolean;
    badgeCount?: number;
    href?: string;
  }> = ({
    icon,
    label,
    view,
    isActive = false,
    disabled = false,
    badgeCount: _badgeCount,
    href,
  }) => (
    <button
      onClick={() => {
        if (href) {
          window.location.href = href;
        } else if (!disabled && view) {
          setActiveView(view as any);
        }
      }}
      disabled={disabled}
      className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 relative ${
        disabled
          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
          : isActive
            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
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
    disabled?: boolean;
  }> = ({ icon, label, view, disabled = false }) => (
    <button
      onClick={() => {
        if (!disabled) {
          setActiveView(view as any);
          setSidebarOpen(false);
        }
      }}
      disabled={disabled}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
        disabled
          ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
          : `hover:bg-green-900 cursor-pointer ${
              activeView === view
                ? "bg-green-900 border-r-4 border-green-300"
                : ""
            }`
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  const Dashboard = () => (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-600 text-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">
          {language === "ar" ? "مرحباً، " : "Welcome, "}
          {currentUser.displayName}
        </h2>
        <p className="text-green-100 mb-4">
          {currentUserType === "gaza_clinician"
            ? language === "ar"
              ? "احصل على استشارات طبية من أطباء متخصصين في المملكة المتحدة"
              : "Connect with UK specialists for medical consultations"
            : language === "ar"
              ? "ساعد الأطباء في غزة بخبرتك الطبية"
              : "Help Gaza clinicians with your medical expertise"}
        </p>
        {currentUserType === "uk_specialist" && (
          <p className="text-green-100 mb-4">
            {language === "ar" ? (
              <>
                لقد ساعدت{" "}
                <span className="font-bold">
                  {currentUser.totalCasesHandled || 0}
                </span>{" "}
                مريضاً حتى الآن!
              </>
            ) : (
              <>
                You have helped{" "}
                <span className="font-bold">
                  {currentUser.totalCasesHandled || 0}
                </span>{" "}
                patients so far!
              </>
            )}
          </p>
        )}
        {currentUserType === "gaza_clinician" && (
          <button
            onClick={() => setActiveView("emergency")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-800 transition-colors cursor-pointer"
          >
            {language === "ar"
              ? "طلب استشارة طارئة"
              : "Request Emergency Consultation"}
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div
        className={`grid gap-4 ${
          viewMode === "mobile" ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        <StatsCard
          icon={<ChatBubbleOvalLeftIcon className="h-5 w-5" />}
          title={language === "ar" ? "الحالات النشطة" : "Active Cases"}
          value="12"
          change="+3"
          color="green"
        />
        <StatsCard
          icon={<UsersIcon className="h-5 w-5" />}
          title={
            language === "ar" ? "المتخصصون المتاحون" : "Available Specialists"
          }
          value={getAvailableSpecialists().length.toString()}
          change="+2"
          color="green"
        />
        <StatsCard
          icon={<ClockIcon className="h-5 w-5" />}
          title={
            language === "ar" ? "متوسط وقت الاستجابة" : "Avg Response Time"
          }
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
            className="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer"
          >
            {language === "ar" ? "عرض الكل" : "View All"}
          </button>
        </div>
        <div className="space-y-3">
          {cases.slice(0, 3).map((case_) => (
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
      blue: "text-green-600 bg-green-100 dark:bg-green-950",
      green: "text-green-600 bg-green-100 dark:bg-green-950",
      purple: "text-purple-600 bg-purple-100 dark:bg-purple-950",
      red: "text-red-600 bg-red-100 dark:bg-red-950",
    };

    return (
      <div
        className={`bg-white ${viewMode === "mobile" ? "dark:bg-black" : "dark:bg-zinc-900"} rounded-lg shadow p-4`}
      >
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
      low: "text-green-600 bg-green-100 dark:bg-green-950 border-green-200 dark:border-green-800",
      medium:
        "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
      high: "text-orange-600 bg-orange-100 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
      critical:
        "text-red-600 bg-red-100 dark:bg-red-950 border-red-200 dark:border-red-800 animate-pulse",
    };

    const urgencyIcons = {
      low: <CheckCircleIcon className="h-4 w-4" />,
      medium: <ClockIcon className="h-4 w-4" />,
      high: <ExclamationCircleIcon className="h-4 w-4" />,
      critical: <ExclamationTriangleIcon className="h-4 w-4" />,
    };

    const specialtyColors = {
      cardiology:
        "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      emergency_medicine:
        "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      orthopedics:
        "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      neurology:
        "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      pediatrics:
        "bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
      general_medicine:
        "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
      surgery:
        "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      psychiatry:
        "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      default:
        "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    };

    const _getSpecialtyColor = (specialty: string) => {
      const normalizedSpecialty = specialty
        .toLowerCase()
        .replace(/[^a-z]/g, "_");
      return (
        specialtyColors[normalizedSpecialty as keyof typeof specialtyColors] ||
        specialtyColors.default
      );
    };

    const statusColors = {
      open: "text-green-600 bg-green-100 dark:bg-green-950",
      in_progress: "text-purple-600 bg-purple-100 dark:bg-purple-950",
      resolved: "text-green-600 bg-green-100 dark:bg-green-950",
      closed: "text-gray-600 bg-gray-100 dark:bg-gray-950",
    };

    const _creator = getUserById(case_.createdBy);

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
                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  urgencyColors[case_.urgency]
                } flex items-center space-x-1`}
              >
                {urgencyIcons[case_.urgency]}
                <span>
                  {language === "ar"
                    ? case_.urgency === "critical"
                      ? "حرجة"
                      : case_.urgency === "high"
                        ? "عالية"
                        : case_.urgency === "medium"
                          ? "متوسطة"
                          : "منخفضة"
                    : case_.urgency}
                </span>
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[case_.status]
                }`}
              >
                {language === "ar"
                  ? case_.status === "open"
                    ? "مفتوحة"
                    : case_.status === "in_progress"
                      ? "قيد المعالجة"
                      : case_.status === "resolved"
                        ? "محلولة"
                        : "مغلقة"
                  : case_.status.replace("_", " ")}
              </span>
              {case_.images && case_.images.length > 0 && (
                <PhotoIcon className="h-3.5 w-3.5 text-gray-400" />
              )}
              {case_.requiresTranslation && (
                <LanguageIcon className="h-3.5 w-3.5 text-green-500" />
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

  // Helper functions for case sorting and filtering
  const getUrgencyPriority = (urgency: string): number => {
    switch (urgency) {
      case "critical":
        return 4;
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  const sortCasesByUrgency = (cases: MedicalCase[]): MedicalCase[] => {
    return [...cases].sort((a, b) => {
      const urgencyDiff =
        getUrgencyPriority(b.urgency) - getUrgencyPriority(a.urgency);
      if (urgencyDiff !== 0) return urgencyDiff;
      // If same urgency, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filterCasesBySpecialty = (cases: MedicalCase[]): MedicalCase[] => {
    if (activeSpecialtyFilter === "all") {
      return cases;
    }
    return cases.filter((case_) => case_.specialty === activeSpecialtyFilter);
  };

  const getActiveCases = (): MedicalCase[] => {
    const activeCases = cases.filter((case_) => case_.status !== "resolved");
    const filteredCases = filterCasesBySpecialty(activeCases);
    return sortCasesByUrgency(filteredCases);
  };

  const getResolvedCases = (): MedicalCase[] => {
    const resolvedCases = cases.filter((case_) => case_.status === "resolved");
    const filteredCases = filterCasesBySpecialty(resolvedCases);
    return sortCasesByUrgency(filteredCases);
  };

  const ForumView = () => {
    if (viewMode === "desktop") {
      return (
        <div className="p-4">
          {/* Desktop Layout - Vertical Stack */}
          <div className="space-y-6">
            {/* Top Row - Post Button and Filters */}
            <div className="flex gap-6 items-start">
              {/* Post Button - Left Side */}
              {currentUserType === "gaza_clinician" && (
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setShowCaseForm(true)}
                    className="bg-green-950 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="font-medium cursor-pointer">
                      {language === "ar" ? "إضافة حالة" : "Post Case"}
                    </span>
                  </button>
                </div>
              )}

              {/* Filters - Right Side */}
              <div className="flex mt-2.5 gap-2 overflow-x-auto pb-2 items-center">
                <FilterChip
                  label={language === "ar" ? "الكل" : "All"}
                  active={activeSpecialtyFilter === "all"}
                  value="all"
                  onClick={setActiveSpecialtyFilter}
                />
                <FilterChip
                  label={language === "ar" ? "قلبية" : "Cardiology"}
                  active={activeSpecialtyFilter === "cardiology"}
                  value="cardiology"
                  onClick={setActiveSpecialtyFilter}
                />
                <FilterChip
                  label={language === "ar" ? "أطفال" : "Pediatrics"}
                  active={activeSpecialtyFilter === "pediatrics"}
                  value="pediatrics"
                  onClick={setActiveSpecialtyFilter}
                />
                <FilterChip
                  label={language === "ar" ? "جراحة" : "Surgery"}
                  active={activeSpecialtyFilter === "surgery"}
                  value="surgery"
                  onClick={setActiveSpecialtyFilter}
                />
                <FilterChip
                  label={language === "ar" ? "طارئة" : "Emergency"}
                  active={activeSpecialtyFilter === "emergency"}
                  value="emergency"
                  onClick={setActiveSpecialtyFilter}
                />
              </div>
            </div>

            {/* Active Cases Grid */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === "ar" ? "الحالات النشطة" : "Active Cases"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getActiveCases().map((case_) => (
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

              {/* Resolved Cases Section */}
              {getResolvedCases().length > 0 && (
                <div>
                  <button
                    onClick={() => setShowResolvedCases(!showResolvedCases)}
                    className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    <span>
                      {language === "ar"
                        ? "الحالات المحلولة"
                        : "Resolved Cases"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({getResolvedCases().length})
                    </span>
                    <ChevronRightIcon
                      className={`h-5 w-5 transform transition-transform ${showResolvedCases ? "rotate-90" : ""}`}
                    />
                  </button>

                  {showResolvedCases && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {getResolvedCases().map((case_) => (
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Mobile Layout - Original
    return (
      <div className="p-4 space-y-4">
        {/* Post Button */}
        {currentUserType === "gaza_clinician" && (
          <div
            className={`flex ${viewMode === "mobile" ? "justify-center" : "justify-end"} mb-4`}
          >
            <button
              onClick={() => setShowCaseForm(true)}
              className="bg-green-950 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors flex items-center space-x-2 cursor-pointer w-full justify-center"
            >
              <PlusIcon className="h-4 w-4" />
              <span>{language === "ar" ? "إضافة حالة" : "Post Case"}</span>
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label={language === "ar" ? "الكل" : "All"}
              active={activeSpecialtyFilter === "all"}
              value="all"
              onClick={setActiveSpecialtyFilter}
            />
            <FilterChip
              label={language === "ar" ? "قلبية" : "Cardiology"}
              active={activeSpecialtyFilter === "cardiology"}
              value="cardiology"
              onClick={setActiveSpecialtyFilter}
            />
            <FilterChip
              label={language === "ar" ? "أطفال" : "Pediatrics"}
              active={activeSpecialtyFilter === "pediatrics"}
              value="pediatrics"
              onClick={setActiveSpecialtyFilter}
            />
            <FilterChip
              label={language === "ar" ? "جراحة" : "Surgery"}
              active={activeSpecialtyFilter === "surgery"}
              value="surgery"
              onClick={setActiveSpecialtyFilter}
            />
            <FilterChip
              label={language === "ar" ? "طارئة" : "Emergency"}
              active={activeSpecialtyFilter === "emergency"}
              value="emergency"
              onClick={setActiveSpecialtyFilter}
            />
          </div>
        </div>

        {/* Active Cases List */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === "ar" ? "الحالات النشطة" : "Active Cases"}
            </h3>
            <div className="space-y-4">
              {getActiveCases().map((case_) => (
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

          {/* Resolved Cases Section */}
          {getResolvedCases().length > 0 && (
            <div>
              <button
                onClick={() => setShowResolvedCases(!showResolvedCases)}
                className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white mb-4 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer w-full"
              >
                <span>
                  {language === "ar" ? "الحالات المحلولة" : "Resolved Cases"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({getResolvedCases().length})
                </span>
                <ChevronRightIcon
                  className={`h-5 w-5 transform transition-transform ${showResolvedCases ? "rotate-90" : ""}`}
                />
              </button>

              {showResolvedCases && (
                <div className="space-y-4">
                  {getResolvedCases().map((case_) => (
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
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const FilterChip: React.FC<{
    label: string;
    active?: boolean;
    value: string;
    onClick: (value: string) => void;
  }> = ({ label, active = false, value, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "bg-green-950 text-white"
          : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
      }`}
    >
      {label}
    </button>
  );

  const CaseDetailView = () => {
    // All hooks must be called before any conditional returns
    const [responses, setResponses] = useState<CaseResponse[]>([]);
    const [newResponse, setNewResponse] = useState("");
    const [showResponseForm, setShowResponseForm] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [editingResponse, setEditingResponse] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [responseDiagnosis, setResponseDiagnosis] = useState("");
    const [responseTreatment, setResponseTreatment] = useState("");
    const [responseUrgency, setResponseUrgency] = useState<
      "low" | "medium" | "high" | "critical"
    >("medium");
    const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [statusChangeReason, setStatusChangeReason] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [responseReplies, setResponseReplies] = useState<
      Record<
        string,
        Array<{
          id: string;
          content: string;
          createdBy: string;
          createdAt: string;
        }>
      >
    >({});

    // Status change functionality
    const changeStatus = async (
      newStatus: "open" | "in_progress" | "resolved" | "closed",
      reason: string = ""
    ) => {
      if (!selectedCase) return;

      setIsChangingStatus(true);
      try {
        // In a real app, this would make an API call
        const updatedCase = {
          ...selectedCase,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...(selectedCase.statusHistory || []),
            {
              status: newStatus,
              changedBy: currentUser.id,
              changedAt: new Date().toISOString(),
              reason: reason.trim() || undefined,
            },
          ],
        };

        // Update the selected case
        setSelectedCase(updatedCase);

        // Reset status change form
        setStatusChangeReason("");
        setIsChangingStatus(false);
      } catch (error) {
        console.error("Failed to change status:", error);
        setIsChangingStatus(false);
      }
    };

    const canChangeStatus = () => {
      // Gaza clinicians can mark their own cases as resolved
      // UK specialists can change status to in_progress or resolved
      // Admins can change any status
      if (currentUserType === "admin") return true;
      if (
        currentUserType === "gaza_clinician" &&
        selectedCase?.createdBy === currentUser.id
      )
        return true;
      if (currentUserType === "uk_specialist") return true;
      return false;
    };

    const getAvailableStatuses = () => {
      if (!selectedCase) return [];

      const currentStatus = selectedCase.status;
      const availableStatuses = [];

      if (currentUserType === "admin") {
        return ["open", "in_progress", "resolved", "closed"];
      }

      if (
        currentUserType === "gaza_clinician" &&
        selectedCase.createdBy === currentUser.id
      ) {
        // Case creator can mark as resolved or reopen
        if (currentStatus === "open" || currentStatus === "in_progress") {
          availableStatuses.push("resolved");
        }
        if (currentStatus === "resolved") {
          availableStatuses.push("open");
        }
      }

      if (currentUserType === "uk_specialist") {
        // Specialists can move cases forward in the workflow
        if (currentStatus === "open") {
          availableStatuses.push("in_progress");
        }
        if (currentStatus === "in_progress") {
          availableStatuses.push("resolved");
        }
      }

      return availableStatuses;
    };
    const [responseReactions, setResponseReactions] = useState<{
      [key: string]: {
        likes: number;
        stars: number;
        userLiked: boolean;
        userStarred: boolean;
      };
    }>(
      responses.reduce(
        (acc, response) => ({
          ...acc,
          [response.id]: {
            likes: response.likeCount || 0,
            stars: response.thanksCount || 0,
            userLiked: false,
            userStarred: false,
          },
        }),
        {}
      )
    );

    const urgencyColors = {
      low: "text-green-600 bg-green-100 dark:bg-green-950 border-green-200 dark:border-green-800",
      medium:
        "text-yellow-600 bg-yellow-100 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
      high: "text-orange-600 bg-orange-100 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
      critical:
        "text-red-600 bg-red-100 dark:bg-red-950 border-red-200 dark:border-red-800 animate-pulse",
    };

    const urgencyIcons = {
      low: <CheckCircleIcon className="h-4 w-4" />,
      medium: <ClockIcon className="h-4 w-4" />,
      high: <ExclamationCircleIcon className="h-4 w-4" />,
      critical: <ExclamationTriangleIcon className="h-4 w-4" />,
    };

    const specialtyColors = {
      cardiology:
        "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
      emergency_medicine:
        "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      orthopedics:
        "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      neurology:
        "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      pediatrics:
        "bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
      general_medicine:
        "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
      surgery:
        "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      psychiatry:
        "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      default:
        "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    };

    const _getSpecialtyColor = (specialty: string) => {
      const normalizedSpecialty = specialty
        .toLowerCase()
        .replace(/[^a-z]/g, "_");
      return (
        specialtyColors[normalizedSpecialty as keyof typeof specialtyColors] ||
        specialtyColors.default
      );
    };

    const statusColors = {
      open: "text-green-600 bg-green-100 dark:bg-green-950",
      in_progress: "text-purple-600 bg-purple-100 dark:bg-purple-950",
      resolved: "text-green-600 bg-green-100 dark:bg-green-950",
      closed: "text-gray-600 bg-gray-100 dark:bg-gray-950",
    };

    // Generate AI summary
    const generateAISummary = async () => {
      if (!selectedCase) return;

      setIsLoadingSummary(true);
      try {
        const response = await fetch("/api/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedCase),
        });
        const data = await response.json();
        setAiSummaries((prev) => ({
          ...prev,
          [selectedCase.id]: data.summary,
        }));
      } catch (error) {
        console.error("Failed to generate summary:", error);
        setAiSummaries((prev) => ({
          ...prev,
          [selectedCase.id]: "Unable to generate summary at this time.",
        }));
      }
      setIsLoadingSummary(false);
    };

    // Load AI summary on mount if not already cached
    React.useEffect(() => {
      if (selectedCase && !aiSummaries[selectedCase.id]) {
        generateAISummary();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCase?.id, generateAISummary]);

    // Create new response
    const createResponse = async () => {
      if (!newResponse.trim() || !currentUser) return;

      setIsSubmittingResponse(true);
      try {
        const newResponseObj: CaseResponse = {
          id: `response_${Date.now()}`,
          caseId: selectedCase.id,
          content: newResponse.trim(),
          responseType: "consultation",
          isPrivate: false,
          isHelpful: true,
          isPrimaryConsultation: responses.length === 0,
          confidenceLevel: "high",
          diagnosis: responseDiagnosis.trim() || undefined,
          treatmentRecommendation: responseTreatment.trim() || undefined,
          urgencyAssessment: responseUrgency,
          additionalTestsNeeded: [],
          language: "en",
          createdBy: currentUser.id,
          likeCount: 0,
          thanksCount: 0,
          helpfulnessRating: 0,
          accuracyRating: 0,
          timelinessScore: 100,
          isRead: false,
          readBy: [],
          acknowledgedBy: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          attachments: uploadedImages.length > 0 ? uploadedImages : undefined,
        };

        // Add to responses list
        setResponses((prev) => [...prev, newResponseObj]);

        // Auto-update case status when a specialist responds
        if (
          currentUserType === "uk_specialist" &&
          selectedCase.status === "open"
        ) {
          changeStatus("in_progress", "Specialist consultation started");
        }

        // Reset form
        setNewResponse("");
        setResponseDiagnosis("");
        setResponseTreatment("");
        setResponseUrgency("medium");
        setUploadedImages([]);
        setShowResponseForm(false);

        // Initialize reaction state for new response
        setResponseReactions((prev) => ({
          ...prev,
          [newResponseObj.id]: {
            likes: 0,
            stars: 0,
            userLiked: false,
            userStarred: false,
          },
        }));
      } catch (error) {
        console.error("Failed to create response:", error);
      } finally {
        setIsSubmittingResponse(false);
      }
    };

    // Edit response
    const startEditingResponse = (responseId: string) => {
      const response = responses.find((r) => r.id === responseId);
      if (response) {
        setEditingResponse(responseId);
        setEditingContent(response.content);
      }
    };

    const saveEditedResponse = () => {
      if (!editingResponse || !editingContent.trim()) return;

      setResponses((prev) =>
        prev.map((response) =>
          response.id === editingResponse
            ? {
                ...response,
                content: editingContent.trim(),
                updatedAt: new Date().toISOString(),
              }
            : response
        )
      );

      setEditingResponse(null);
      setEditingContent("");
    };

    const cancelEditing = () => {
      setEditingResponse(null);
      setEditingContent("");
    };

    // Delete response
    const deleteResponse = (responseId: string) => {
      if (
        confirm(
          language === "ar"
            ? "هل أنت متأكد من حذف هذه الاستشارة؟"
            : "Are you sure you want to delete this response?"
        )
      ) {
        setResponses((prev) => prev.filter((r) => r.id !== responseId));
        setResponseReactions((prev) => {
          const newReactions = { ...prev };
          delete newReactions[responseId];
          return newReactions;
        });
      }
    };

    // Handle image upload
    const handleImageUpload = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = e.target.files;
      if (files) {
        const uploadPromises = Array.from(files).map(async (file) => {
          try {
            const uploadedImage = await uploadToCloudflare(file);
            return uploadedImage.url;
          } catch (error) {
            console.error("Failed to upload image:", error);
            // Fallback to data URL
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  resolve(event.target.result as string);
                }
              };
              reader.readAsDataURL(file);
            });
          }
        });

        const newImages = await Promise.all(uploadPromises);
        setUploadedImages([...uploadedImages, ...newImages]);
      }
    };

    // Handle reply submission
    const submitReply = (responseId: string) => {
      if (!replyContent.trim()) return;

      const newReply = {
        id: `reply_${Date.now()}`,
        content: replyContent,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      setResponseReplies((prev) => ({
        ...prev,
        [responseId]: [...(prev[responseId] || []), newReply],
      }));

      setReplyContent("");
      setReplyingTo(null);
    };

    // Handle reaction toggles
    const handleLike = (responseId: string) => {
      setResponseReactions((prev) => ({
        ...prev,
        [responseId]: {
          ...prev[responseId],
          likes: prev[responseId].userLiked
            ? prev[responseId].likes - 1
            : prev[responseId].likes + 1,
          userLiked: !prev[responseId].userLiked,
        },
      }));
    };

    const handleStar = (responseId: string) => {
      setResponseReactions((prev) => ({
        ...prev,
        [responseId]: {
          ...prev[responseId],
          stars: prev[responseId].userStarred
            ? prev[responseId].stars - 1
            : prev[responseId].stars + 1,
          userStarred: !prev[responseId].userStarred,
        },
      }));
    };

    return (
      <div className="p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView("forum")}
            className="text-green-600 hover:text-green-800 p-2 -ml-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 cursor-pointer"
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
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                urgencyColors[selectedCase.urgency]
              } flex items-center space-x-2`}
            >
              {urgencyIcons[selectedCase.urgency]}
              <span>
                {language === "ar"
                  ? selectedCase.urgency === "critical"
                    ? "حرجة"
                    : selectedCase.urgency === "high"
                      ? "عالية"
                      : selectedCase.urgency === "medium"
                        ? "متوسطة"
                        : "منخفضة"
                  : selectedCase.urgency}
              </span>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[selectedCase.status]
              }`}
            >
              {language === "ar"
                ? selectedCase.status === "open"
                  ? "مفتوحة"
                  : selectedCase.status === "in_progress"
                    ? "قيد المعالجة"
                    : selectedCase.status === "resolved"
                      ? "محلولة"
                      : "مغلقة"
                : selectedCase.status.replace("_", " ")}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getSpecialtyColor(selectedCase.specialty)}`}
            >
              {selectedCase.specialty}
            </span>
          </div>

          {/* Status Management */}
          {canChangeStatus() && getAvailableStatuses().length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === "ar"
                  ? "إدارة حالة القضية"
                  : "Case Status Management"}
              </h4>

              <div className="flex flex-wrap gap-2 mb-3">
                {getAvailableStatuses().map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      changeStatus(
                        status as
                          | "open"
                          | "in_progress"
                          | "resolved"
                          | "closed",
                        statusChangeReason
                      )
                    }
                    disabled={isChangingStatus}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === "ar"
                      ? status === "open"
                        ? "فتح"
                        : status === "in_progress"
                          ? "قيد المعالجة"
                          : status === "resolved"
                            ? "محلولة"
                            : "مغلقة"
                      : status.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {language === "ar"
                    ? "سبب التغيير (اختياري)"
                    : "Reason for change (optional)"}
                </label>
                <input
                  type="text"
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "اشرح سبب تغيير الحالة..."
                      : "Explain the reason for status change..."
                  }
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                />
              </div>

              {isChangingStatus && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
                  <span>
                    {language === "ar"
                      ? "جاري التحديث..."
                      : "Updating status..."}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Status History */}
          {selectedCase.statusHistory &&
            selectedCase.statusHistory.length > 0 && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-2">
                  {language === "ar"
                    ? "تاريخ تغييرات الحالة"
                    : "Status Change History"}
                </summary>
                <div className="pl-4 space-y-2">
                  {selectedCase.statusHistory.map((change, idx) => {
                    const changer = getUserById(change.changedBy);
                    return (
                      <div
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-zinc-700 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {language === "ar"
                              ? change.status === "open"
                                ? "مفتوحة"
                                : change.status === "in_progress"
                                  ? "قيد المعالجة"
                                  : change.status === "resolved"
                                    ? "محلولة"
                                    : "مغلقة"
                              : change.status.replace("_", " ")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(change.changedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {language === "ar" ? "بواسطة" : "by"}{" "}
                          {changer?.displayName || "Unknown"}
                          {change.reason && (
                            <span className="ml-2 italic">
                              - {change.reason}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            )}

          <h2 className="text-xl font-bold dark:text-white mb-2">
            {selectedCase.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedCase.description}
          </p>

          {/* Case Images */}
          {selectedCase.images && selectedCase.images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === "ar" ? "الصور المرفقة:" : "Attached Images:"}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedCase.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Case image ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-zinc-700 cursor-pointer hover:opacity-90"
                    onClick={() => window.open(img, "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AI Summary Section */}
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {language === "ar" ? "ملخص الذكاء الاصطناعي" : "AI Summary"}
                </h3>
              </div>
            </div>
            {isLoadingSummary ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {language === "ar"
                    ? "جارٍ إنشاء الملخص..."
                    : "Generating summary..."}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {aiSummary}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span>
                {new Date(selectedCase.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-3.5 w-3.5" />
              <span>{selectedCase.viewCount}</span>
              <button
                onClick={() => {
                  const currentLike = caseLikes[selectedCase.id] || {
                    likes: selectedCase.likeCount,
                    userLiked: false,
                  };
                  setCaseLikes((prev) => ({
                    ...prev,
                    [selectedCase.id]: {
                      likes: currentLike.userLiked
                        ? currentLike.likes - 1
                        : currentLike.likes + 1,
                      userLiked: !currentLike.userLiked,
                    },
                  }));
                }}
                className={`flex items-center space-x-1 ml-2 transition-colors cursor-pointer ${
                  caseLikes[selectedCase.id]?.userLiked
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                }`}
              >
                <HandThumbUpIcon
                  className={`h-3.5 w-3.5 ${caseLikes[selectedCase.id]?.userLiked ? "fill-current" : ""}`}
                />
                <span>
                  {caseLikes[selectedCase.id]?.likes || selectedCase.likeCount}
                </span>
              </button>
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
                <div
                  key={test.id}
                  className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium dark:text-white">
                      {test.testName}
                    </h4>
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
                    <strong>
                      {language === "ar" ? "النتيجة:" : "Result:"}
                    </strong>{" "}
                    {test.result}
                    {test.unit && ` ${test.unit}`}
                  </p>
                  {test.normalRange && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <strong>
                        {language === "ar"
                          ? "المعدل الطبيعي:"
                          : "Normal Range:"}
                      </strong>{" "}
                      {test.normalRange}
                    </p>
                  )}
                  {test.interpretation && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>
                        {language === "ar" ? "التفسير:" : "Interpretation:"}
                      </strong>{" "}
                      {test.interpretation}
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
              {language === "ar" ? "الاستشارات" : "Consultations"} (
              {responses.length})
            </h3>
            {currentUserType === "uk_specialist" && (
              <button
                onClick={() => setShowResponseForm(!showResponseForm)}
                className="bg-green-950 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <PlusIcon className="h-4 w-4" />
                <span>
                  {language === "ar" ? "إضافة استشارة" : "Add Response"}
                </span>
              </button>
            )}
          </div>

          {/* Response Form */}
          {showResponseForm && (
            <div className="mb-6 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
              {/* Main Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "الاستشارة" : "Consultation Response"}
                </label>
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "اكتب استشارتك هنا..."
                      : "Write your consultation here..."
                  }
                  className="w-full h-32 p-3 border border-gray-300 dark:border-zinc-600 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Diagnosis Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "التشخيص" : "Diagnosis"}
                </label>
                <input
                  type="text"
                  value={responseDiagnosis}
                  onChange={(e) => setResponseDiagnosis(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "التشخيص المحتمل..."
                      : "Working diagnosis..."
                  }
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Treatment Recommendation */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar"
                    ? "العلاج المقترح"
                    : "Treatment Recommendation"}
                </label>
                <input
                  type="text"
                  value={responseTreatment}
                  onChange={(e) => setResponseTreatment(e.target.value)}
                  placeholder={
                    language === "ar" ? "خطة العلاج..." : "Treatment plan..."
                  }
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Urgency Assessment */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "تقييم الأولوية" : "Urgency Assessment"}
                </label>
                <select
                  value={responseUrgency}
                  onChange={(e) =>
                    setResponseUrgency(
                      e.target.value as "low" | "medium" | "high" | "critical"
                    )
                  }
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                >
                  <option value="low">
                    {language === "ar" ? "منخفضة" : "Low"}
                  </option>
                  <option value="medium">
                    {language === "ar" ? "متوسطة" : "Medium"}
                  </option>
                  <option value="high">
                    {language === "ar" ? "عالية" : "High"}
                  </option>
                  <option value="critical">
                    {language === "ar" ? "حرجة" : "Critical"}
                  </option>
                </select>
              </div>

              {/* Image Upload Section */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors">
                    <PhotoIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "إرفاق صور" : "Attach Images"}
                    </span>
                  </div>
                </label>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() =>
                            setUploadedImages(
                              uploadedImages.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowResponseForm(false);
                    setNewResponse("");
                    setResponseDiagnosis("");
                    setResponseTreatment("");
                    setResponseUrgency("medium");
                    setUploadedImages([]);
                  }}
                  disabled={isSubmittingResponse}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer disabled:opacity-50"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={createResponse}
                  disabled={!newResponse.trim() || isSubmittingResponse}
                  className="bg-green-950 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingResponse ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <PaperAirplaneIcon className="h-4 w-4" />
                  )}
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
                <div
                  key={response.id}
                  className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {currentUser?.id !== response.createdBy && (
                        <div className="w-10 h-10 bg-green-950 rounded-full flex items-center justify-center text-white relative overflow-hidden">
                          {responder?.role === "gaza_clinician" ? (
                            <Image
                              src="/images/gaza-flag.png"
                              alt="Gaza Flag"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : responder?.role === "uk_specialist" ? (
                            <Image
                              src="/images/uk-flag.jpg"
                              alt="UK Flag"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="h-4 w-4" />
                          )}
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {currentUser?.id === response.createdBy
                            ? language === "ar"
                              ? "أنت"
                              : "You"
                            : language === "ar"
                              ? "طبيب"
                              : "Doctor"}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {currentUser?.id !== response.createdBy &&
                            responder?.role !== "gaza_clinician" &&
                            responder?.specialties?.[0] && (
                              <>{responder.specialties[0]} • </>
                            )}
                          {new Date(response.createdAt).toLocaleDateString()}
                          {response.updatedAt !== response.createdAt && (
                            <span className="ml-2 italic">
                              ({language === "ar" ? "معدّل" : "edited"})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {response.isPrimaryConsultation && (
                        <span className="bg-green-100 text-green-600 dark:bg-green-950 px-2 py-1 rounded-full text-xs font-medium">
                          {language === "ar" ? "استشارة أولية" : "Primary"}
                        </span>
                      )}
                      {/* Edit/Delete buttons for own responses */}
                      {currentUser?.id === response.createdBy && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditingResponse(response.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title={language === "ar" ? "تعديل" : "Edit"}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteResponse(response.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            title={language === "ar" ? "حذف" : "Delete"}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Content - Edit Mode */}
                  {editingResponse === response.id ? (
                    <div className="mb-3">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full h-24 p-3 border border-gray-300 dark:border-zinc-600 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white mb-2"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer"
                        >
                          {language === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                          onClick={saveEditedResponse}
                          disabled={!editingContent.trim()}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {language === "ar" ? "حفظ" : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {response.content}
                    </p>
                  )}

                  {/* Show attachments if any */}
                  {response.attachments && response.attachments.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {response.attachments.map((attachment, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={attachment}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {response.diagnosis && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {language === "ar" ? "التشخيص:" : "Diagnosis:"}
                      </span>
                      <span className="ml-2 text-sm dark:text-white">
                        {response.diagnosis}
                      </span>
                    </div>
                  )}

                  {response.treatmentRecommendation && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {language === "ar" ? "العلاج المقترح:" : "Treatment:"}
                      </span>
                      <span className="ml-2 text-sm dark:text-white">
                        {response.treatmentRecommendation}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(response.id)}
                        className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                          responseReactions[response.id]?.userLiked
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                        }`}
                      >
                        <HandThumbUpIcon
                          className={`h-3.5 w-3.5 ${responseReactions[response.id]?.userLiked ? "fill-current" : ""}`}
                        />
                        <span className="text-sm">
                          {responseReactions[response.id]?.likes ||
                            response.likeCount}
                        </span>
                      </button>
                      <button
                        onClick={() => handleStar(response.id)}
                        className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                          responseReactions[response.id]?.userStarred
                            ? "text-yellow-500 dark:text-yellow-400"
                            : "text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
                        }`}
                      >
                        <StarIcon
                          className={`h-3.5 w-3.5 ${responseReactions[response.id]?.userStarred ? "fill-current" : ""}`}
                        />
                        <span className="text-sm">
                          {responseReactions[response.id]?.stars ||
                            response.thanksCount}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === response.id ? null : response.id
                          )
                        }
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <ChatBubbleOvalLeftIcon className="h-3.5 w-3.5" />
                        <span className="text-sm">
                          {language === "ar" ? "رد" : "Reply"}
                          {responseReplies[response.id]?.length
                            ? ` (${responseReplies[response.id].length})`
                            : ""}
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <span>
                        {language === "ar" ? "مفيدة" : "Helpful"}:{" "}
                        {response.helpfulnessRating}/5
                      </span>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === response.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-950 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {currentUser.displayName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={
                              language === "ar"
                                ? "اكتب ردك..."
                                : "Write a reply..."
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white resize-none"
                            rows={2}
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer"
                            >
                              {language === "ar" ? "إلغاء" : "Cancel"}
                            </button>
                            <button
                              onClick={() => submitReply(response.id)}
                              disabled={!replyContent.trim()}
                              className="px-3 py-1 text-sm bg-green-950 text-white rounded hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {language === "ar"
                                ? "إرسال الرد"
                                : "Submit Reply"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Display Replies */}
                  {responseReplies[response.id] &&
                    responseReplies[response.id].length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-3">
                        {responseReplies[response.id].map((reply) => {
                          const replyUser = getUserById(reply.createdBy);
                          return (
                            <div
                              key={reply.id}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {replyUser?.displayName.charAt(0) || "U"}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {replyUser?.displayName || "Unknown"}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      reply.createdAt
                                    ).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const IncidentsView = () => (
    <div className="p-4 space-y-4">
      <div className="space-y-4">
        {incidents.map((incident) => {
          const reportedUser = getUserById(incident.reportedUser);
          const reportingUser = getUserById(incident.reportedBy);

          return (
            <div
              key={incident.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 border border-gray-200 dark:border-zinc-700"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold dark:text-white text-lg mb-1">
                    {incident.caseTitle}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {incident.reportReason}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 dark:bg-yellow-950">
                  {language === "ar" ? "قيد المراجعة" : "Pending"}
                </span>
              </div>

              <div className="mb-4 text-sm">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {incident.reportDetails}
                </p>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "المبلغ عنه:" : "Reported User:"}
                    </span>
                    <span className="ml-2 dark:text-white">
                      {reportedUser?.displayName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "المبلغ:" : "Reported By:"}
                    </span>
                    <span className="ml-2 dark:text-white">
                      {reportingUser?.displayName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "تاريخ البلاغ:" : "Reported:"}
                    </span>
                    <span className="ml-2 dark:text-white">
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`flex space-x-3 ${viewMode === "desktop" ? "justify-start" : ""}`}
              >
                <button
                  onClick={() => handleIgnoreIncident(incident.id)}
                  className={`${viewMode === "desktop" ? "w-auto" : "flex-1"} bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 cursor-pointer`}
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>{language === "ar" ? "تجاهل" : "Ignore"}</span>
                </button>
                <button
                  onClick={() => handleBanUser(incident.id)}
                  className={`${viewMode === "desktop" ? "w-auto" : "flex-1"} bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer`}
                >
                  <NoSymbolIcon className="h-4 w-4" />
                  <span>{language === "ar" ? "حظر المستخدم" : "Ban"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {incidents.length === 0 && (
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            {language === "ar" ? "لا توجد حوادث" : "No Incidents"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {language === "ar"
              ? "سيتم عرض البلاغات الجديدة هنا"
              : "New incident reports will appear here"}
          </p>
        </div>
      )}
    </div>
  );

  const ProfileView = () => {
    const [tempAvailabilityStatus, setTempAvailabilityStatus] = useState(
      currentUser.availabilityStatus
    );
    const [tempLanguage, setTempLanguage] = useState(language);

    const handleStatusChange = (newStatus: string) => {
      setTempAvailabilityStatus(
        newStatus as typeof currentUser.availabilityStatus
      );
      // In a real app, this would update the user's status in the database
    };

    const handleLanguageChange = (newLanguage: "en" | "ar") => {
      setTempLanguage(newLanguage);
      // Update the actual language using the toggleLanguage function
      if (newLanguage !== language) {
        toggleLanguage();
      }
    };

    return (
      <div className="p-4 space-y-6">
        {/* Current User Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-green-950 rounded-full flex items-center justify-center text-white relative overflow-hidden">
              {currentUserType === "gaza_clinician" ? (
                <Image
                  src="/images/gaza-flag.png"
                  alt="Gaza Flag"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : currentUserType === "uk_specialist" ? (
                <Image
                  src="/images/uk-flag.jpg"
                  alt="UK Flag"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="h-7 w-7" />
              )}
              {currentUserType === "uk_specialist" && (
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white z-50 ${
                    tempAvailabilityStatus === "available"
                      ? "bg-green-400"
                      : tempAvailabilityStatus === "busy"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                  }`}
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold dark:text-white">
                {currentUser.displayName}
              </h3>
              {currentUser.role !== "gaza_clinician" &&
                currentUser.role !== "admin" && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentUser.specialties?.[0]} • {currentUser.points}{" "}
                    {language === "ar" ? "نقطة" : "pts"}
                  </p>
                )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser.role === "gaza_clinician"
                  ? language === "ar"
                    ? "طبيب غزة"
                    : "Gaza Clinician"
                  : currentUser.role === "uk_specialist"
                    ? language === "ar"
                      ? "أخصائي بريطاني"
                      : "UK Specialist"
                    : language === "ar"
                      ? "مدير النظام"
                      : "System Admin"}
              </p>
            </div>
          </div>

          {/* Language Selection for All Users */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {language === "ar" ? "اللغة المفضلة:" : "Preferred Language:"}
            </label>
            <div className="flex gap-3 max-w-md">
              <button
                onClick={() => handleLanguageChange("en")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all cursor-pointer ${
                  tempLanguage === "en"
                    ? "border-green-600 bg-green-600 text-white shadow-lg"
                    : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("ar")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all cursor-pointer ${
                  tempLanguage === "ar"
                    ? "border-green-600 bg-green-600 text-white shadow-lg"
                    : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                العربية
              </button>
            </div>
            {tempLanguage === "en" && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-left">
                You have selected English
              </p>
            )}
            {tempLanguage === "ar" && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-left">
                لقد اخترت العربية
              </p>
            )}
          </div>

          {/* Status Management for UK Specialists */}
          {currentUserType === "uk_specialist" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === "ar" ? "الحالة:" : "Status:"}
              </label>
              <div className="space-y-3">
                {[
                  {
                    value: "available",
                    label: language === "ar" ? "متاح" : "Available",
                    color: "bg-green-400",
                  },
                  {
                    value: "busy",
                    label: language === "ar" ? "مشغول" : "Busy",
                    color: "bg-yellow-400",
                  },
                  {
                    value: "offline",
                    label: language === "ar" ? "غير متصل" : "Offline",
                    color: "bg-gray-400",
                  },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      tempAvailabilityStatus === status.value
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${status.color}`} />
                    <span className="text-sm dark:text-white font-medium">
                      {status.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Type Switcher (Demo only) */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {language === "ar"
              ? "تجريبي: تبديل نوع المستخدم"
              : "Demo: Switch User Type"}
          </label>
          <select
            value={currentUserId}
            onChange={(e) => setCurrentUserId(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm"
          >
            <optgroup
              label={language === "ar" ? "أطباء غزة" : "Gaza Clinicians"}
            >
              {dummyPublicUsers
                .filter((u) => u.role === "gaza_clinician")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
            </optgroup>
            <optgroup
              label={language === "ar" ? "أخصائيو بريطانيا" : "UK Specialists"}
            >
              {dummyPublicUsers
                .filter((u) => u.role === "uk_specialist")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
            </optgroup>
            <optgroup label={language === "ar" ? "المدراء" : "Admins"}>
              {dummyPublicUsers
                .filter((u) => u.role === "admin")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
            </optgroup>
          </select>
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
        return (
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {language === "ar" ? "قريباً..." : "Coming soon..."}
            </p>
          </div>
        );
      case "scheduled":
        return (
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {language === "ar" ? "قريباً..." : "Coming soon..."}
            </p>
          </div>
        );
      case "profile":
        return <ProfileView />;
      case "case-detail":
        return <CaseDetailView />;
      case "registration-requests":
        return (
          <AdminRegistrationModal
            pendingRequests={pendingRequests}
            reviewedRequests={reviewedRequests}
            setPendingRequests={setPendingRequests}
            setReviewedRequests={setReviewedRequests}
            language={language}
            viewMode={viewMode}
          />
        );
      case "incidents":
        return <IncidentsView />;
      default:
        return <Dashboard />;
    }
  };

  // Initial login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Image
                src="/app-icon.png"
                alt="Jusur"
                width={64}
                height={64}
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
              onClick={handleShowLogin}
              className="w-full bg-green-950 text-white py-3 px-4 rounded-lg hover:bg-green-900 transition-colors font-medium cursor-pointer"
            >
              {language === "ar"
                ? "تسجيل الدخول (طبيب من المملكة المتحدة أو غزة)"
                : "Login (UK or Gaza Clinician)"}
            </button>

            <button
              onClick={handleShowRegistration}
              className="w-full bg-green-950 text-white py-3 px-4 rounded-lg hover:bg-green-900 transition-colors font-medium cursor-pointer"
            >
              {language === "ar" ? "تسجيل حساب جديد" : "Register New Account"}
            </button>

            <button
              onClick={handleStartNoLogin}
              className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
            >
              {language === "ar"
                ? "استكشاف بدون تسجيل دخول"
                : "Explore without login"}
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors font-medium cursor-pointer flex items-center justify-center space-x-2"
            >
              <HomeIcon className="h-4 w-4" />
              <span>
                {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </span>
            </button>
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "ar" ? "تسجيل الدخول" : "Login"}
                </h2>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {!showForgotPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-950 dark:bg-zinc-800 dark:text-white"
                      placeholder={
                        language === "ar"
                          ? "أدخل البريد الإلكتروني"
                          : "Enter email"
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === "ar" ? "كلمة المرور" : "Password"}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-950 dark:bg-zinc-800 dark:text-white"
                      placeholder={
                        language === "ar"
                          ? "أدخل كلمة المرور"
                          : "Enter password"
                      }
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm italic text-green-600 hover:text-green-800 cursor-pointer hover:underline"
                    >
                      {language === "ar"
                        ? "نسيت كلمة المرور؟"
                        : "Forgot password?"}
                    </button>
                  </div>

                  {loginError && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {loginError}
                    </p>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-950 text-white py-2 px-4 rounded-lg hover:bg-green-900 transition-colors font-medium cursor-pointer"
                    >
                      {language === "ar" ? "دخول" : "Login"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
                    >
                      {language === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === "ar"
                        ? "البريد الإلكتروني"
                        : "Email Address"}
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-950 dark:bg-zinc-800 dark:text-white"
                      placeholder={
                        language === "ar"
                          ? "أدخل البريد الإلكتروني"
                          : "Enter your email address"
                      }
                      required
                    />
                  </div>

                  {forgotPasswordMessage && (
                    <p
                      className={`text-sm ${forgotPasswordMessage.includes("sent") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {forgotPasswordMessage}
                    </p>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-950 text-white py-2 px-4 rounded-lg hover:bg-green-900 transition-colors font-medium cursor-pointer"
                    >
                      {language === "ar"
                        ? "إرسال كلمة المرور"
                        : "Send Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
                    >
                      {language === "ar" ? "العودة" : "Back"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Registration Modal */}
        <EnhancedRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          language={language}
        />
      </div>
    );
  }

  // Show loading state during hydration to prevent mismatch
  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-zinc-950 ${
        viewMode === "desktop" ? "flex" : ""
      }`}
    >
      <ViewSwitcher />

      {viewMode === "desktop" && <SidebarNav />}

      <div
        className={`flex-1 flex flex-col relative z-40 ${
          viewMode === "desktop" ? "ml-64" : ""
        }`}
      >
        {/* Container with responsive width */}
        <div
          className={`w-full ${
            viewMode === "mobile"
              ? "max-w-sm mx-auto min-h-screen border-x border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
              : "max-w-none"
          }`}
        >
          <Header />
          <main
            className={`flex-1 overflow-auto ${
              viewMode === "mobile" ? "pb-20" : ""
            }`}
          >
            {renderContent()}
          </main>

          {viewMode === "mobile" && <MobileBottomNav />}
        </div>
      </div>

      {viewMode === "mobile" && (
        <>
          {/* Backdrop overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <SidebarNav />
        </>
      )}

      {/* Offline Banner
      {isOffline && (
        <div
          className={`fixed ${viewMode === "mobile" ? "top-16" : "top-4"} bg-yellow-100 border border-yellow-300 rounded-lg p-2 flex items-center space-x-2 z-40 w-80 ${
            viewMode === "desktop"
              ? "left-68 right-4"
              : viewMode === "mobile"
                ? "left-1/2 transform -translate-x-1/2 w-80 max-w-[calc(100vw-2rem)]"
                : "left-4 right-4"
          }`}
        >
          <NoSymbolIcon className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <span className="text-yellow-800 text-sm truncate">
            {language === "ar" ? "عمل بدون اتصال" : "Working offline"}
          </span>
        </div>
      )} */}

      {/* Case Creation Modal */}
      {showCaseForm && (
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 bg-zinc-900/50">
          <div
            className={`bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-4 sm:p-6 overflow-y-auto ${
              viewMode === "mobile"
                ? "w-[340px] h-[780px] max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-1rem)]"
                : "w-full max-w-2xl h-[90vh] max-h-[800px]"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {language === "ar" ? "إضافة حالة جديدة" : "Create New Case"}
              </h2>
              <button
                onClick={() => {
                  setShowCaseForm(false);
                  setNewCaseTitle("");
                  setNewCaseDescription("");
                  setNewCaseImages([]);
                  setPatientAge("");
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                // Create new case
                const newCase: MedicalCase = {
                  id: `case_${Date.now()}`,
                  title: newCaseTitle,
                  description: newCaseDescription,
                  specialty: newCaseSpecialty,
                  urgency: newCaseUrgency,
                  status: "open" as const,
                  createdBy: currentUserId,
                  createdAt: new Date().toISOString(),
                  responseCount: 0,
                  viewCount: 0,
                  likeCount: 0,
                  patientAge: patientAge ? parseInt(patientAge) : undefined,
                  patientGender: patientGender,
                  testResults: testResults.length > 0 ? testResults : undefined,
                  images: newCaseImages.length > 0 ? newCaseImages : undefined,
                };

                // Add to cases list
                setCases((prev) => [newCase, ...prev]);

                // Clear form and close modal
                setShowCaseForm(false);
                setNewCaseTitle("");
                setNewCaseDescription("");
                setNewCaseSpecialty("general_medicine");
                setNewCaseUrgency("medium");
                setNewCaseImages([]);
                setPatientAge("");
                setPatientGender("male");
                setTestResults([]);
                setNewTestName("");
                setNewTestResult("");
              }}
              className="space-y-6"
            >
              {/* Case Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "عنوان الحالة" : "Case Title"} *
                </label>
                <input
                  type="text"
                  required
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "أدخل عنوان الحالة..."
                      : "Enter case title..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "ar" ? "عمر المريض" : "Patient Age"}
                  </label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder={language === "ar" ? "العمر" : "Age"}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "ar" ? "الجنس" : "Gender"}
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) =>
                      setPatientGender(
                        e.target.value as "male" | "female" | "other"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="male">
                      {language === "ar" ? "ذكر" : "Male"}
                    </option>
                    <option value="female">
                      {language === "ar" ? "أنثى" : "Female"}
                    </option>
                    <option value="other">
                      {language === "ar" ? "أخرى" : "Other"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Specialty and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "ar" ? "التخصص" : "Specialty"} *
                  </label>
                  <select
                    required
                    value={newCaseSpecialty}
                    onChange={(e) => setNewCaseSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="general_medicine">
                      {language === "ar" ? "طب عام" : "General Medicine"}
                    </option>
                    <option value="cardiology">
                      {language === "ar" ? "قلبية" : "Cardiology"}
                    </option>
                    <option value="pediatrics">
                      {language === "ar" ? "أطفال" : "Pediatrics"}
                    </option>
                    <option value="neurology">
                      {language === "ar" ? "أعصاب" : "Neurology"}
                    </option>
                    <option value="surgery">
                      {language === "ar" ? "جراحة" : "Surgery"}
                    </option>
                    <option value="emergency">
                      {language === "ar" ? "طوارئ" : "Emergency"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "ar" ? "مستوى الإلحاح" : "Urgency Level"} *
                  </label>
                  <select
                    required
                    value={newCaseUrgency}
                    onChange={(e) =>
                      setNewCaseUrgency(
                        e.target.value as "low" | "medium" | "high" | "critical"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="low">
                      {language === "ar" ? "منخفض" : "Low"}
                    </option>
                    <option value="medium">
                      {language === "ar" ? "متوسط" : "Medium"}
                    </option>
                    <option value="high">
                      {language === "ar" ? "عالي" : "High"}
                    </option>
                    <option value="critical">
                      {language === "ar" ? "حرج" : "Critical"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Test Results Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "نتائج الفحوصات" : "Test Results"}
                </label>

                {/* Add Test Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "اسم الفحص (مثل: درجة الحرارة)"
                        : "Test name (e.g., Temperature)"
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTestResult}
                      onChange={(e) => setNewTestResult(e.target.value)}
                      placeholder={
                        language === "ar"
                          ? "النتيجة (مثل: 38.5°C)"
                          : "Result (e.g., 38.5°C)"
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTestName.trim() && newTestResult.trim()) {
                          setTestResults((prev) => [
                            ...prev,
                            {
                              testName: newTestName.trim(),
                              result: newTestResult.trim(),
                            },
                          ]);
                          setNewTestName("");
                          setNewTestResult("");
                        }
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer"
                    >
                      {language === "ar" ? "إضافة" : "Add"}
                    </button>
                  </div>
                </div>

                {/* Display added test results */}
                {testResults.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {testResults.map((test, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800 p-2 rounded"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>{test.testName}:</strong> {test.result}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setTestResults((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                        >
                          {language === "ar" ? "حذف" : "Remove"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Example test suggestions */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {language === "ar" ? "أمثلة: " : "Examples: "}
                  <span className="italic">
                    {language === "ar"
                      ? "درجة الحرارة: 38.5°C، ضغط الدم: 120/80، نبضات القلب: 85 نبضة/دقيقة"
                      : "Temperature: 38.5°C, Blood Pressure: 120/80, Heart Rate: 85 bpm"}
                  </span>
                </div>
              </div>

              {/* Case Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "وصف الحالة" : "Case Description"} *
                </label>
                <textarea
                  required
                  rows={6}
                  value={newCaseDescription}
                  onChange={(e) => setNewCaseDescription(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "أدخل وصف تفصيلي للحالة..."
                      : "Enter detailed case description..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "صور الحالة" : "Case Images"}
                </label>
                <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files) {
                        const uploadPromises = Array.from(files).map(
                          async (file) => {
                            try {
                              const uploadedImage =
                                await uploadToCloudflare(file);
                              return uploadedImage.url;
                            } catch (error) {
                              console.error("Failed to upload image:", error);
                              // Fallback to data URL
                              return new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    resolve(event.target.result as string);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }
                        );

                        const newImages = await Promise.all(uploadPromises);
                        setNewCaseImages([...newCaseImages, ...newImages]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        {language === "ar" ? "انقر لتحميل" : "Click to upload"}
                      </span>{" "}
                      {language === "ar" ? "أو اسحب وأفلت" : "or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF
                    </p>
                  </div>
                </label>

                {/* Image Previews */}
                {newCaseImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {newCaseImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewCaseImages(
                              newCaseImages.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCaseForm(false);
                    setNewCaseTitle("");
                    setNewCaseDescription("");
                    setNewCaseImages([]);
                    setPatientAge("");
                  }}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="bg-green-950 text-white px-6 py-2 rounded-lg hover:bg-green-900 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>
                    {language === "ar" ? "إنشاء الحالة" : "Create Case"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
