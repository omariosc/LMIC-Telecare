import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  Video,
  MessageCircle,
  Bell,
  Search,
  Settings,
  Heart,
  FileText,
  Phone,
  Users,
  Activity,
  Shield,
  Globe,
  Smartphone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Upload,
  Send,
  Star,
  Award,
  Zap,
  Filter,
  Eye,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Plus,
  Languages,
  Wifi,
  WifiOff,
  FileImage,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  type: "uk-specialist" | "gaza-clinician" | "admin";
  specialty?: string;
  gmcNumber?: string;
  institution?: string;
  verified: boolean;
  points?: number;
  availability?: "available" | "busy" | "offline";
}

interface CasePost {
  id: string;
  title: string;
  description: string;
  specialty: string;
  urgency: "routine" | "urgent" | "emergency";
  author: string;
  authorType: "gaza-clinician";
  timestamp: string;
  status: "open" | "in-progress" | "resolved";
  replies: number;
  hasImages: boolean;
  translated?: boolean;
}

interface Consultation {
  id: string;
  patientCase: string;
  specialist: string;
  clinician: string;
  type: "forum" | "emergency" | "scheduled";
  status: "pending" | "active" | "completed";
  scheduledTime?: string;
  responseTime?: string;
}

const GazaTelecareWireframe: React.FC = () => {
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "forum"
    | "emergency"
    | "scheduled"
    | "profile"
    | "admin"
    | "case-detail"
    | "verification"
  >("dashboard");
  const [userType, setUserType] = useState<
    "uk-specialist" | "gaza-clinician" | "admin"
  >("gaza-clinician");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CasePost | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [language, setLanguage] = useState<"en" | "ar">("ar");

  const currentUser: User = {
    id: "1",
    name: userType === "uk-specialist" ? "Dr. Sarah Johnson" : "د. أحمد محمد",
    type: userType,
    specialty: userType === "uk-specialist" ? "Cardiology" : "General Medicine",
    gmcNumber: userType === "uk-specialist" ? "GMC123456" : undefined,
    institution:
      userType === "gaza-clinician" ? "Gaza Medical Complex" : undefined,
    verified: true,
    points: userType === "uk-specialist" ? 1250 : undefined,
    availability: userType === "uk-specialist" ? "available" : undefined,
  };

  const mockCases: CasePost[] = [
    {
      id: "1",
      title: "Complex cardiac case - 45yo male",
      description:
        "45-year-old male presenting with chest pain and elevated troponins...",
      specialty: "Cardiology",
      urgency: "urgent",
      author: "Dr. Ahmad Hassan",
      authorType: "gaza-clinician",
      timestamp: "2 hours ago",
      status: "open",
      replies: 0,
      hasImages: true,
      translated: language === "en",
    },
    {
      id: "2",
      title: "Pediatric respiratory distress",
      description: "3-year-old child with acute respiratory symptoms...",
      specialty: "Pediatrics",
      urgency: "emergency",
      author: "Dr. Fatima Al-Zahra",
      authorType: "gaza-clinician",
      timestamp: "30 minutes ago",
      status: "in-progress",
      replies: 3,
      hasImages: false,
      translated: language === "en",
    },
    {
      id: "3",
      title: "Surgical consult needed - abdominal pain",
      description:
        "Patient with acute abdominal pain, considering surgical intervention...",
      specialty: "Surgery",
      urgency: "routine",
      author: "Dr. Mohammed Nasser",
      authorType: "gaza-clinician",
      timestamp: "1 day ago",
      status: "resolved",
      replies: 7,
      hasImages: true,
      translated: language === "en",
    },
  ];

  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-gray-800 mr-3"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <Heart className="text-white" size={16} />
          </div>
          <span className="font-bold text-gray-800 hidden sm:block">
            Gaza Telecare
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
        >
          <Languages size={16} />
        </button>

        <div className="flex items-center space-x-1">
          {isOffline ? (
            <WifiOff className="text-red-500" size={16} />
          ) : (
            <Wifi className="text-green-500" size={16} />
          )}
          <span className="text-xs text-gray-600 hidden sm:block">
            {isOffline ? "Offline" : "Online"}
          </span>
        </div>

        <div className="relative">
          <Bell
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            size={20}
          />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>

        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <User size={16} />
        </div>
      </div>
    </header>
  );

  const SidebarNav = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <Heart className="text-white" size={16} />
          </div>
          <h1 className="text-lg font-bold">Gaza Telecare</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white hover:text-blue-200"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-8">
        <NavItem icon={<Activity />} label="Dashboard" view="dashboard" />
        <NavItem icon={<MessageSquare />} label="Medical Forum" view="forum" />
        {userType === "gaza-clinician" && (
          <NavItem icon={<Zap />} label="Emergency Consult" view="emergency" />
        )}
        <NavItem icon={<Calendar />} label="Scheduled MDTs" view="scheduled" />
        {userType === "admin" && (
          <NavItem icon={<Shield />} label="Admin Panel" view="admin" />
        )}
        <NavItem icon={<User />} label="Profile" view="profile" />
      </nav>

      {/* User Type Switcher (Demo only) */}
      <div className="absolute bottom-20 left-0 right-0 px-4">
        <div className="bg-blue-700 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-200 mb-2">Demo: Switch User Type</p>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as any)}
            className="w-full bg-blue-600 text-white border border-blue-500 rounded px-2 py-1 text-sm"
          >
            <option value="gaza-clinician">Gaza Clinician</option>
            <option value="uk-specialist">UK Specialist</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center relative">
            <User size={16} />
            {currentUser.verified && (
              <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400 bg-blue-800 rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-blue-200 truncate">
              {currentUser.specialty}
              {currentUser.points && ` • ${currentUser.points} pts`}
            </p>
            {currentUser.availability && (
              <div className="flex items-center mt-1">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${
                    currentUser.availability === "available"
                      ? "bg-green-400"
                      : currentUser.availability === "busy"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs text-blue-200 capitalize">
                  {currentUser.availability}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
          {currentUser.name}
        </h2>
        <p className="text-blue-100 mb-4">
          {userType === "gaza-clinician"
            ? language === "ar"
              ? "احصل على استشارات طبية من أطباء متخصصين في المملكة المتحدة"
              : "Connect with UK specialists for medical consultations"
            : language === "ar"
            ? "ساعد الأطباء في غزة بخبرتك الطبية"
            : "Help Gaza clinicians with your medical expertise"}
        </p>
        {userType === "gaza-clinician" && (
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<MessageSquare />}
          title={language === "ar" ? "الحالات النشطة" : "Active Cases"}
          value="12"
          change="+3"
          color="blue"
        />
        <StatsCard
          icon={<Users />}
          title={
            language === "ar" ? "المتخصصون المتاحون" : "Available Specialists"
          }
          value="24"
          change="+2"
          color="green"
        />
        <StatsCard
          icon={<Clock />}
          title={
            language === "ar" ? "متوسط وقت الاستجابة" : "Avg Response Time"
          }
          value="45m"
          change="-10m"
          color="purple"
        />
        <StatsCard
          icon={<CheckCircle />}
          title={language === "ar" ? "الحالات المحلولة" : "Cases Resolved"}
          value="156"
          change="+12"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
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
          {mockCases.slice(0, 3).map((case_) => (
            <CaseCard key={case_.id} case_={case_} compact={true} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {userType === "gaza-clinician" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickActionCard
              icon={<Plus />}
              title={language === "ar" ? "إضافة حالة جديدة" : "Post New Case"}
              color="blue"
              onClick={() => setActiveView("forum")}
            />
            <QuickActionCard
              icon={<Zap />}
              title={language === "ar" ? "استشارة طارئة" : "Emergency Consult"}
              color="red"
              onClick={() => setActiveView("emergency")}
            />
            <QuickActionCard
              icon={<Calendar />}
              title={language === "ar" ? "جدولة اجتماع" : "Schedule MDT"}
              color="green"
              onClick={() => setActiveView("scheduled")}
            />
          </div>
        </div>
      )}
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
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      red: "text-red-600 bg-red-100",
    };

    return (
      <div className="bg-white rounded-lg shadow p-4">
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
                : "text-gray-600"
            }`}
          >
            {change}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold">{value}</h3>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    );
  };

  const QuickActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    color: string;
    onClick: () => void;
  }> = ({ icon, title, color, onClick }) => {
    const colorClasses = {
      blue: "border-blue-200 hover:bg-blue-50 text-blue-600",
      red: "border-red-200 hover:bg-red-50 text-red-600",
      green: "border-green-200 hover:bg-green-50 text-green-600",
    };

    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
          colorClasses[color as keyof typeof colorClasses]
        }`}
      >
        <div className="mb-2">{icon}</div>
        <span className="text-sm font-medium text-center">{title}</span>
      </button>
    );
  };

  const ForumView = () => (
    <div className="p-4 space-y-4">
      {/* Header with Post Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {language === "ar" ? "المنتدى الطبي" : "Medical Forum"}
        </h2>
        {userType === "gaza-clinician" && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>{language === "ar" ? "إضافة حالة" : "Post Case"}</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
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
        {mockCases.map((case_) => (
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
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  const CaseCard: React.FC<{
    case_: CasePost;
    compact?: boolean;
    onClick?: () => void;
  }> = ({ case_, compact = false, onClick }) => {
    const urgencyColors = {
      routine: "text-green-600 bg-green-100",
      urgent: "text-yellow-600 bg-yellow-100",
      emergency: "text-red-600 bg-red-100",
    };

    const statusColors = {
      open: "text-blue-600 bg-blue-100",
      "in-progress": "text-purple-600 bg-purple-100",
      resolved: "text-green-600 bg-green-100",
    };

    return (
      <div
        className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${
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
                {case_.urgency}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[case_.status]
                }`}
              >
                {case_.status.replace("-", " ")}
              </span>
              {case_.hasImages && (
                <FileImage size={14} className="text-gray-400" />
              )}
              {case_.translated && (
                <Languages size={14} className="text-blue-500" />
              )}
            </div>
            <h3
              className={`font-semibold ${
                compact ? "text-sm" : "text-base"
              } mb-1`}
            >
              {case_.title}
            </h3>
            {!compact && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {case_.description}
              </p>
            )}
          </div>
          {onClick && <ChevronRight size={20} className="text-gray-400" />}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{case_.author}</span>
            <span>•</span>
            <span>{case_.specialty}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{case_.timestamp}</span>
            {case_.replies > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle size={14} />
                <span>{case_.replies}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EmergencyView = () => (
    <div className="p-4 space-y-6">
      {/* Emergency Header */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="text-red-600" size={20} />
          <h2 className="text-lg font-bold text-red-800">
            {language === "ar"
              ? "الاستشارات الطارئة"
              : "Emergency Consultations"}
          </h2>
        </div>
        <p className="text-red-700 text-sm">
          {language === "ar"
            ? "للحالات الطارئة التي تحتاج استجابة فورية من المتخصصين"
            : "For urgent cases requiring immediate specialist response"}
        </p>
      </div>

      {/* Quick Emergency Request */}
      {userType === "gaza-clinician" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {language === "ar"
              ? "طلب استشارة طارئة"
              : "Request Emergency Consultation"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "ar" ? "التخصص المطلوب" : "Required Specialty"}
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>
                  {language === "ar" ? "اختر التخصص..." : "Select specialty..."}
                </option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
                <option>Surgery</option>
                <option>Emergency Medicine</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "ar"
                  ? "وصف سريع للحالة"
                  : "Brief Case Description"}
              </label>
              <textarea
                rows={3}
                placeholder={
                  language === "ar"
                    ? "اكتب وصفاً موجزاً للحالة الطارئة..."
                    : "Briefly describe the emergency case..."
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              {language === "ar" ? "إرسال طلب طارئ" : "Send Emergency Request"}
            </button>
          </div>
        </div>
      )}

      {/* Available Specialists */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {language === "ar"
            ? "المتخصصون المتاحون الآن"
            : "Currently Available Specialists"}
        </h3>
        <div className="space-y-3">
          <SpecialistCard
            name="Dr. Sarah Johnson"
            specialty="Cardiology"
            responseTime="~5 minutes"
            rating={4.9}
            status="available"
          />
          <SpecialistCard
            name="Dr. Michael Chen"
            specialty="Pediatrics"
            responseTime="~8 minutes"
            rating={4.8}
            status="available"
          />
          <SpecialistCard
            name="Dr. Emma Williams"
            specialty="Surgery"
            responseTime="~12 minutes"
            rating={4.7}
            status="busy"
          />
        </div>
      </div>

      {/* Recent Emergency Cases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {language === "ar"
            ? "الحالات الطارئة الأخيرة"
            : "Recent Emergency Cases"}
        </h3>
        <div className="space-y-3">
          {mockCases
            .filter((c) => c.urgency === "emergency")
            .map((case_) => (
              <CaseCard key={case_.id} case_={case_} compact={true} />
            ))}
        </div>
      </div>
    </div>
  );

  const SpecialistCard: React.FC<{
    name: string;
    specialty: string;
    responseTime: string;
    rating: number;
    status: "available" | "busy" | "offline";
  }> = ({ name, specialty, responseTime, rating, status }) => {
    const statusColors = {
      available: "text-green-600 bg-green-100",
      busy: "text-yellow-600 bg-yellow-100",
      offline: "text-gray-600 bg-gray-100",
    };

    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-600">{specialty}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{responseTime}</span>
              <Star size={12} className="text-yellow-500" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
          >
            {status}
          </span>
          {status === "available" && (
            <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm">
              {language === "ar" ? "اتصال" : "Contact"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const CaseDetailView = () => (
    <div className="p-4 space-y-6">
      {selectedCase && (
        <>
          {/* Case Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => setActiveView("forum")}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <ChevronRight size={16} className="rotate-180 mr-1" />
                {language === "ar" ? "العودة للمنتدى" : "Back to Forum"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedCase.urgency === "emergency"
                    ? "text-red-600 bg-red-100"
                    : selectedCase.urgency === "urgent"
                    ? "text-yellow-600 bg-yellow-100"
                    : "text-green-600 bg-green-100"
                }`}
              >
                {selectedCase.urgency}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                {selectedCase.specialty}
              </span>
              {selectedCase.translated && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                  <Languages size={12} className="inline mr-1" />
                  {language === "ar" ? "مترجم" : "Translated"}
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold mb-3">{selectedCase.title}</h1>
            <p className="text-gray-700 mb-4">{selectedCase.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{selectedCase.author}</span>
                <span>•</span>
                <span>{selectedCase.timestamp}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <ThumbsUp size={16} />
                  <span>5</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <Eye size={16} />
                  <span>23</span>
                </button>
              </div>
            </div>
          </div>

          {/* Images/Attachments */}
          {selectedCase.hasImages && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">
                {language === "ar" ? "الصور والمرفقات" : "Images & Attachments"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileImage size={32} className="text-gray-400" />
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText size={32} className="text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Responses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                {language === "ar" ? "الردود" : "Responses"} (
                {selectedCase.replies})
              </h3>
              {userType === "uk-specialist" && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  {language === "ar" ? "أضف رد" : "Add Response"}
                </button>
              )}
            </div>

            {selectedCase.replies > 0 ? (
              <div className="space-y-4">
                <ResponseCard
                  author="Dr. Sarah Johnson"
                  authorType="UK Specialist"
                  content="Based on the symptoms and test results, I would recommend starting with..."
                  timestamp="1 hour ago"
                  helpful={true}
                />
                <ResponseCard
                  author="Dr. Michael Chen"
                  authorType="UK Specialist"
                  content="I agree with Dr. Johnson's assessment. Additionally, consider..."
                  timestamp="45 minutes ago"
                  helpful={false}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle
                  size={48}
                  className="mx-auto mb-2 text-gray-300"
                />
                <p>
                  {language === "ar" ? "لا توجد ردود بعد" : "No responses yet"}
                </p>
                <p className="text-sm">
                  {language === "ar"
                    ? "كن أول من يقدم المساعدة"
                    : "Be the first to help"}
                </p>
              </div>
            )}
          </div>

          {/* Add Response Form */}
          {userType === "uk-specialist" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">
                {language === "ar" ? "أضف ردك" : "Add Your Response"}
              </h3>
              <div className="space-y-4">
                <textarea
                  rows={4}
                  placeholder={
                    language === "ar"
                      ? "اكتب ردك هنا..."
                      : "Write your response here..."
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                      <FileImage size={16} />
                      <span className="text-sm">
                        {language === "ar" ? "إرفاق ملف" : "Attach File"}
                      </span>
                    </button>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    {language === "ar" ? "إرسال الرد" : "Send Response"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const ResponseCard: React.FC<{
    author: string;
    authorType: string;
    content: string;
    timestamp: string;
    helpful: boolean;
  }> = ({ author, authorType, content, timestamp, helpful }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm">{author}</p>
            <p className="text-xs text-gray-600">{authorType}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
      <p className="text-gray-700 mb-3">{content}</p>
      <div className="flex items-center space-x-4">
        <button
          className={`flex items-center space-x-1 text-sm ${
            helpful ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
          }`}
        >
          <ThumbsUp size={14} />
          <span>{language === "ar" ? "مفيد" : "Helpful"} (3)</span>
        </button>
        <button className="text-gray-600 hover:text-blue-600 text-sm">
          {language === "ar" ? "رد" : "Reply"}
        </button>
      </div>
    </div>
  );

  const ScheduledView = () => (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {language === "ar" ? "الاجتماعات المجدولة" : "Scheduled MDT Meetings"}
        </h2>
        {userType === "gaza-clinician" && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {language === "ar" ? "جدولة اجتماع" : "Schedule Meeting"}
          </button>
        )}
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">
          {language === "ar" ? "الاجتماعات القادمة" : "Upcoming Meetings"}
        </h3>
        <div className="space-y-4">
          <MeetingCard
            title="Complex Cardiac Case Review"
            date="July 20, 2025"
            time="14:00 GMT"
            participants={[
              "Dr. Sarah Johnson",
              "Dr. Ahmad Hassan",
              "Dr. Michael Chen",
            ]}
            status="confirmed"
          />
          <MeetingCard
            title="Pediatric Emergency Protocols"
            date="July 22, 2025"
            time="15:30 GMT"
            participants={["Dr. Emma Williams", "Dr. Fatima Al-Zahra"]}
            status="pending"
          />
        </div>
      </div>

      {/* Meeting History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">
          {language === "ar" ? "تاريخ الاجتماعات" : "Meeting History"}
        </h3>
        <div className="space-y-3">
          <MeetingCard
            title="Surgical Consultation - Abdominal Case"
            date="July 18, 2025"
            time="16:00 GMT"
            participants={["Dr. James Wilson", "Dr. Mohammed Nasser"]}
            status="completed"
            summary="Patient recommended for conservative treatment..."
          />
        </div>
      </div>
    </div>
  );

  const MeetingCard: React.FC<{
    title: string;
    date: string;
    time: string;
    participants: string[];
    status: "confirmed" | "pending" | "completed";
    summary?: string;
  }> = ({ title, date, time, participants, status, summary }) => {
    const statusColors = {
      confirmed: "text-green-600 bg-green-100",
      pending: "text-yellow-600 bg-yellow-100",
      completed: "text-gray-600 bg-gray-100",
    };

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{title}</h4>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <div className="flex items-center space-x-4">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium">
            {language === "ar" ? "المشاركون:" : "Participants:"}
          </span>
          <span className="ml-1">{participants.join(", ")}</span>
        </div>
        {summary && <p className="text-sm text-gray-700 mb-3">{summary}</p>}
        <div className="flex space-x-2">
          {status === "confirmed" && (
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              {language === "ar" ? "انضم للاجتماع" : "Join Meeting"}
            </button>
          )}
          <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50">
            {language === "ar" ? "التفاصيل" : "Details"}
          </button>
        </div>
      </div>
    );
  };

  const ProfileView = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">
        {language === "ar" ? "الملف الشخصي" : "Profile"}
      </h2>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{currentUser.name}</h3>
            <p className="text-gray-600">{currentUser.specialty}</p>
            {currentUser.institution && (
              <p className="text-sm text-gray-500">{currentUser.institution}</p>
            )}
            {currentUser.gmcNumber && (
              <p className="text-sm text-gray-500">
                GMC: {currentUser.gmcNumber}
              </p>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="text-green-500" size={20} />
          <span className="text-green-700 font-medium">
            {language === "ar" ? "حساب موثق" : "Verified Account"}
          </span>
        </div>

        {/* Stats for UK Specialists */}
        {userType === "uk-specialist" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {currentUser.points}
              </p>
              <p className="text-sm text-gray-600">
                {language === "ar" ? "نقاط التطوع" : "Volunteer Points"}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">47</p>
              <p className="text-sm text-gray-600">
                {language === "ar" ? "الاستشارات" : "Consultations"}
              </p>
            </div>
          </div>
        )}

        {/* Availability (UK Specialists only) */}
        {userType === "uk-specialist" && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">
              {language === "ar" ? "حالة التوفر" : "Availability Status"}
            </h4>
            <div className="flex space-x-2">
              <button className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium">
                {language === "ar" ? "متاح" : "Available"}
              </button>
              <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg">
                {language === "ar" ? "مشغول" : "Busy"}
              </button>
              <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg">
                {language === "ar" ? "غير متصل" : "Offline"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">
          {language === "ar" ? "الإعدادات" : "Settings"}
        </h3>
        <div className="space-y-4">
          <SettingItem
            title={language === "ar" ? "الإشعارات" : "Notifications"}
            description={
              language === "ar"
                ? "إدارة إشعارات الاستشارات والرسائل"
                : "Manage consultation and message notifications"
            }
          />
          <SettingItem
            title={language === "ar" ? "الخصوصية" : "Privacy"}
            description={
              language === "ar"
                ? "إعدادات الخصوصية والأمان"
                : "Privacy and security settings"
            }
          />
          <SettingItem
            title={language === "ar" ? "اللغة" : "Language"}
            description={
              language === "ar"
                ? "تغيير لغة التطبيق"
                : "Change application language"
            }
          />
        </div>
      </div>

      {/* Recognition (UK Specialists only) */}
      {userType === "uk-specialist" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">
            {language === "ar"
              ? "الإنجازات والتقدير"
              : "Achievements & Recognition"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <AchievementBadge
              icon={<Award />}
              title="First Responder"
              earned={true}
            />
            <AchievementBadge
              icon={<Star />}
              title="Helpful Expert"
              earned={true}
            />
            <AchievementBadge
              icon={<Heart />}
              title="Volunteer Hero"
              earned={false}
            />
            <AchievementBadge
              icon={<Users />}
              title="Team Player"
              earned={false}
            />
          </div>
        </div>
      )}
    </div>
  );

  const SettingItem: React.FC<{ title: string; description: string }> = ({
    title,
    description,
  }) => (
    <div className="flex justify-between items-center py-2">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );

  const AchievementBadge: React.FC<{
    icon: React.ReactNode;
    title: string;
    earned: boolean;
  }> = ({ icon, title, earned }) => (
    <div
      className={`p-3 rounded-lg border text-center ${
        earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div
        className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
          earned ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
        }`}
      >
        {icon}
      </div>
      <p
        className={`text-xs font-medium ${
          earned ? "text-yellow-800" : "text-gray-500"
        }`}
      >
        {title}
      </p>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "forum":
        return <ForumView />;
      case "emergency":
        return <EmergencyView />;
      case "scheduled":
        return <ScheduledView />;
      case "profile":
        return <ProfileView />;
      case "case-detail":
        return <CaseDetailView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <SidebarNav />
      <div className="flex-1 lg:ml-0">
        <Header />
        <main className="overflow-auto">{renderContent()}</main>
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center space-x-2 lg:left-68">
          <WifiOff size={16} className="text-yellow-600" />
          <span className="text-yellow-800 text-sm">
            {language === "ar"
              ? "العمل في وضع عدم الاتصال - سيتم مزامنة البيانات عند الاتصال"
              : "Working offline - Data will sync when connection is restored"}
          </span>
        </div>
      )}
    </div>
  );
};

export default GazaTelecareWireframe;
