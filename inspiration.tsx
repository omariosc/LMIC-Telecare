import React, { useState, useEffect } from "react";
import {
  Camera,
  Video,
  MessageSquare,
  Calendar,
  Users,
  Star,
  Clock,
  Shield,
  Phone,
  Upload,
  Send,
  Search,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Globe,
  Settings,
  Bell,
  Plus,
  X,
  ChevronRight,
  Stethoscope,
  Activity,
} from "lucide-react";

const RemoteClinicApp = () => {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [onCallStatus, setOnCallStatus] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [gmcNumber, setGmcNumber] = useState("");
  const [verificationStep, setVerificationStep] = useState(1);

  // Mock data
  const mockUser = {
    name: "Dr. Sarah Johnson",
    specialty: "Emergency Medicine",
    gmcNumber: "GMC123456",
    rating: 4.8,
    experience: "15 years",
    verified: true,
    hospital: "St. Mary's Hospital, London",
  };

  const mockEmergencyRequests = [
    {
      id: 1,
      priority: "Critical",
      description: "Severe chest trauma, patient conscious",
      requester: "Dr. Ahmed Hassan",
      location: "Field Hospital, Syria",
      timestamp: "2 min ago",
      specialty: "Emergency Medicine",
      images: 2,
    },
    {
      id: 2,
      priority: "High",
      description: "Complex fracture, multiple injuries",
      requester: "Dr. Maria Santos",
      location: "Mobile Clinic, Gaza",
      timestamp: "8 min ago",
      specialty: "Orthopedics",
      images: 3,
    },
  ];

  const mockMDTCases = [
    {
      id: 1,
      title: "Complex Cardiac Case",
      description: "Multiple comorbidities, surgical decision needed",
      participants: 12,
      scheduled: "2024-07-16 14:00",
      specialties: ["Cardiology", "Anesthesiology", "Surgery"],
      status: "scheduled",
    },
    {
      id: 2,
      title: "Pediatric Trauma Review",
      description: "Post-operative complications discussion",
      participants: 8,
      scheduled: "2024-07-15 16:30",
      specialties: ["Pediatrics", "Trauma Surgery"],
      status: "active",
    },
  ];

  const mockConsultations = [
    {
      id: 1,
      type: "Routine",
      description: "Post-operative care guidance",
      requester: "Dr. James Wilson",
      timestamp: "1 hour ago",
      status: "pending",
      specialty: "General Surgery",
    },
    {
      id: 2,
      type: "Follow-up",
      description: "Medication adjustment query",
      requester: "Dr. Lisa Chen",
      timestamp: "3 hours ago",
      status: "responded",
      specialty: "Internal Medicine",
    },
  ];

  // Login/Verification Screen
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Remote Clinic
          </h1>
          <p className="text-gray-600">
            Connecting medical professionals worldwide
          </p>
        </div>

        {verificationStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">GMC Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GMC Number
                </label>
                <input
                  type="text"
                  value={gmcNumber}
                  onChange={(e) => setGmcNumber(e.target.value)}
                  placeholder="Enter your GMC number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setVerificationStep(2)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify GMC Number
              </button>
            </div>
          </div>
        )}

        {verificationStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Face Verification</h2>
            <div className="text-center space-y-4">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600">
                Position your face in the camera frame
              </p>
              <button
                onClick={() => setVerificationStep(3)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Start Face Scan
              </button>
            </div>
          </div>
        )}

        {verificationStep === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-green-700">
                Verification Successful!
              </h2>
              <p className="text-gray-600">Welcome, Dr. Johnson</p>
              <p className="text-sm text-gray-500">
                Emergency Medicine Specialist
              </p>
              <button
                onClick={() => {
                  setUser(mockUser);
                  setCurrentScreen("dashboard");
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Enter Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.specialty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  onCallStatus ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {onCallStatus ? "On Call" : "Off Call"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={onCallStatus}
                  onChange={(e) => setOnCallStatus(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-sm text-gray-600">Cases Resolved</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">4.8</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Emergency Requests */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Emergency Requests
            </h3>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {mockEmergencyRequests.length} Active
            </span>
          </div>
          <div className="space-y-3">
            {mockEmergencyRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedCase(request);
                  setCurrentScreen("emergency");
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.priority === "Critical"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {request.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {request.timestamp}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {request.description}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {request.requester} • {request.location}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setCurrentScreen("mdt")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">MDT Sessions</p>
                <p className="text-sm text-gray-500">Team discussions</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setCurrentScreen("consultations")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Consultations</p>
                <p className="text-sm text-gray-500">Remote advice</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`flex flex-col items-center py-2 ${
              currentScreen === "dashboard" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentScreen("emergency")}
            className={`flex flex-col items-center py-2 ${
              currentScreen === "emergency" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <AlertCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Emergency</span>
          </button>
          <button
            onClick={() => setCurrentScreen("mdt")}
            className={`flex flex-col items-center py-2 ${
              currentScreen === "mdt" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">MDT</span>
          </button>
          <button
            onClick={() => setCurrentScreen("consultations")}
            className={`flex flex-col items-center py-2 ${
              currentScreen === "consultations"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs mt-1">Consults</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Emergency Consultation Screen
  const EmergencyScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <p className="font-semibold text-gray-900">
                Emergency Consultation
              </p>
              <p className="text-sm text-gray-500">Dr. Ahmed Hassan</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">LIVE</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Globe className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Call Area */}
      <div className="px-4 py-6">
        <div
          className="bg-black rounded-lg mb-4 relative"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-16 h-16 text-white opacity-50" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="bg-red-600 p-3 rounded-full hover:bg-red-700">
                <Phone className="w-6 h-6 text-white" />
              </button>
              <button className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
                <Video className="w-6 h-6 text-white" />
              </button>
              <button className="bg-gray-600 p-3 rounded-full hover:bg-gray-700">
                <MessageSquare className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full">
              <span className="text-white text-sm">15:23</span>
            </div>
          </div>
        </div>

        {/* Case Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Case Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Priority:</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Critical
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="text-gray-900">Field Hospital, Syria</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="text-gray-900">Male, 35 years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <span className="text-gray-900">Severe chest trauma</span>
            </div>
          </div>
        </div>

        {/* Live Translation */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Live Translation (Arabic → English)
            </span>
          </div>
          <p className="text-sm text-blue-800">
            "Patient has difficulty breathing, chest wall appears unstable,
            possible pneumothorax..."
          </p>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Live Chat</h3>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-900">
                  Need immediate guidance on chest tube placement
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dr. Hassan • 2 min ago
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-600 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-white">
                  Understood. Can you show me the chest X-ray?
                </p>
                <p className="text-xs text-blue-200 mt-1">You • 1 min ago</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // MDT Screen
  const MDTScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">MDT Sessions</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="space-y-4">
          {mockMDTCases.map((case_) => (
            <div key={case_.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {case_.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {case_.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {case_.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    case_.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {case_.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {case_.participants} participants
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {case_.scheduled}
                    </span>
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  Join Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Consultations Screen
  const ConsultationsScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Remote Consultations
          </h1>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="space-y-4">
          {mockConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {consultation.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {consultation.timestamp}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {consultation.description}
                  </h3>
                  <p className="text-sm text-gray-600">
                    From: {consultation.requester} • {consultation.specialty}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    consultation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {consultation.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main App Render
  return (
    <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen">
      {currentScreen === "login" && <LoginScreen />}
      {currentScreen === "dashboard" && <DashboardScreen />}
      {currentScreen === "emergency" && <EmergencyScreen />}
      {currentScreen === "mdt" && <MDTScreen />}
      {currentScreen === "consultations" && <ConsultationsScreen />}
    </div>
  );
};

export default RemoteClinicApp;
