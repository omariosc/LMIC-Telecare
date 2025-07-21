"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  XMarkIcon,
  CameraIcon,
  ArrowLeftIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Tesseract from "tesseract.js";

type RegistrationData = {
  gmcNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "uk_specialist" | "gaza_clinician";
  specialties: string[];
  institution: string;
  yearsOfExperience: number;
  referralCode: string;
};

type VerificationStatus = "pending" | "verifying" | "verified" | "failed";

type EnhancedRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "ar";
  initialPage?: "choice" | "login" | "role";
};

export default function EnhancedRegistrationModal({
  isOpen,
  onClose,
  language,
  initialPage = "choice",
}: EnhancedRegistrationModalProps) {
  // Main flow state
  const [currentPage, setCurrentPage] = useState<
    | "choice"
    | "login"
    | "forgot_password"
    | "role"
    | "gmc"
    | "id"
    | "camera"
    | "nhs_email"
    | "tfa"
    | "password"
    | "referral"
    | "gaza_email"
    | "gaza_password"
    | "complete"
  >("choice");
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    gmcNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "uk_specialist",
    specialties: [],
    institution: "",
    yearsOfExperience: 0,
    referralCode: "",
  });

  // Verification states
  const [gmcVerificationStatus, setGmcVerificationStatus] =
    useState<VerificationStatus>("pending");
  const [idVerificationStatus, setIdVerificationStatus] =
    useState<VerificationStatus>("pending");
  const [nhsEmailVerificationStatus, setNhsEmailVerificationStatus] =
    useState<VerificationStatus>("pending");
  const [tfaVerificationStatus, setTfaVerificationStatus] =
    useState<VerificationStatus>("pending");

  // Camera and file states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [uploadedIdImage, setUploadedIdImage] = useState<string | null>(null);

  // 2FA states
  const [tfaCode, setTfaCode] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Completion countdown state
  const [completionCountdown, setCompletionCountdown] = useState(3);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isLoginFlow, setIsLoginFlow] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(initialPage);
      setError("");
      resetAllStates();
    } else {
      // Clear error when modal closes
      setError("");
    }
  }, [isOpen, initialPage]);

  // Clear error when page changes
  useEffect(() => {
    setError("");
  }, [currentPage]);

  // Handle completion countdown and redirect
  useEffect(() => {
    if (currentPage === "complete" && completionCountdown > 0) {
      const timer = setTimeout(() => {
        if (completionCountdown <= 1) {
          // Redirect to app page directly to avoid state update issues
          window.location.href = "/app";
        } else {
          setCompletionCountdown((prev) => prev - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPage, completionCountdown]);

  // Countdown timer for resend code
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

  // Automatically start camera when camera page is shown
  useEffect(() => {
    if (currentPage === "camera" && !isCameraActive && !capturedPhoto) {
      console.warn("Auto-starting camera for facial verification");
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startCamera();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentPage, isCameraActive, capturedPhoto, startCamera]);

  const resetAllStates = () => {
    setRegistrationData({
      gmcNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "uk_specialist",
      specialties: [],
      institution: "",
      yearsOfExperience: 0,
      referralCode: "",
    });
    setGmcVerificationStatus("pending");
    setIdVerificationStatus("pending");
    setNhsEmailVerificationStatus("pending");
    setTfaVerificationStatus("pending");
    setCapturedPhoto(null);
    setUploadedIdImage(null);
    setTfaCode(["", "", "", "", "", ""]);
    setResendCountdown(0);
    setIsResendDisabled(false);
    setCompletionCountdown(3);
    setLoginEmail("");
    setLoginPassword("");
    setForgotPasswordEmail("");
    setIsLoginFlow(false);
  };

  // GMC Verification
  const verifyGMC = async () => {
    if (!registrationData.gmcNumber.trim()) {
      setError(
        language === "ar" ? "يرجى إدخال رقم GMC" : "Please enter GMC number"
      );
      return;
    }

    if (
      registrationData.gmcNumber.length !== 7 ||
      !/^\d{7}$/.test(registrationData.gmcNumber)
    ) {
      setError(
        language === "ar"
          ? "رقم GMC يجب أن يكون 7 أرقام بالضبط"
          : "GMC number must be exactly 7 digits"
      );
      return;
    }

    setGmcVerificationStatus("verifying");
    setError("");

    try {
      const response = await fetch(
        `/api/fetchGmcName?gmc=${registrationData.gmcNumber}`
      );
      const data = await response.json();

      if (data.valid) {
        setRegistrationData((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          institution: data.institution,
          yearsOfExperience: data.yearsOfExperience,
          specialties: data.specialties,
        }));
        setGmcVerificationStatus("verified");
      } else {
        setGmcVerificationStatus("failed");
        setError(
          data.error ||
            (language === "ar" ? "رقم GMC غير صالح" : "Invalid GMC number")
        );
      }
    } catch {
      setGmcVerificationStatus("failed");
      setError(
        language === "ar" ? "فشل التحقق من GMC" : "GMC verification failed"
      );
    }
  };

  // ID Verification with OCR
  const handleIdUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageSrc = e.target?.result as string;
      setUploadedIdImage(imageSrc);

      setIdVerificationStatus("verifying");
      setError("");

      try {
        // Use Tesseract.js for OCR
        // Create a worker with inline initialization to avoid CSP issues
        const worker = await Tesseract.createWorker({
          logger: (m) => console.warn(m),
          errorHandler: (err) => console.error(err),
        });

        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        const {
          data: { text },
        } = await worker.recognize(imageSrc);

        await worker.terminate();

        console.warn("OCR Extracted Text:", text);

        // Extract all words from the OCR text and clean them
        const extractedText = text.toLowerCase();
        const extractedWords = extractedText
          .split(/\s+/) // Split by any whitespace
          .map((word) => word.replace(/[^a-z]/g, "")) // Remove non-alphabetic characters
          .filter((word) => word.length > 2); // Only keep words longer than 2 characters

        console.warn("Extracted words:", extractedWords);

        // Get all name parts from GMC data (first name, last name, and any parts of them)
        const firstName = registrationData.firstName.toLowerCase();
        const lastName = registrationData.lastName.toLowerCase();

        // Split names into individual words (in case of compound names)
        const nameWords = [
          ...firstName.split(/[\s-]+/),
          ...lastName.split(/[\s-]+/),
        ].filter((word) => word.length > 2);

        console.warn("Name words to match:", nameWords);

        // Check if ANY word from the name appears in the extracted words
        // Also check for partial matches (at least 3 characters matching)
        const foundMatch = nameWords.some((nameWord) => {
          return extractedWords.some((extractedWord) => {
            // Direct match or contains
            if (
              extractedWord.includes(nameWord) ||
              nameWord.includes(extractedWord)
            ) {
              return true;
            }

            // Check for partial match (at least 3 consecutive characters)
            for (let i = 0; i <= extractedWord.length - 3; i++) {
              const substring = extractedWord.substring(i, i + 3);
              if (nameWord.includes(substring)) {
                return true;
              }
            }

            return false;
          });
        });

        if (foundMatch) {
          setIdVerificationStatus("verified");
          setTimeout(() => setCurrentPage("camera"), 1000);
        } else {
          setIdVerificationStatus("failed");
          setError(
            language === "ar"
              ? "لا يمكن التحقق من الهوية. تأكد من أن الاسم يطابق سجل GMC. يمكنك النقر على 'تخطي' للمتابعة"
              : "Cannot verify ID. Ensure name matches GMC record. You can click 'Skip' to continue"
          );
        }
      } catch (error) {
        console.error("OCR Error:", error);

        // If OCR fails due to CSP or other issues, show skip option prominently
        if (error.message && error.message.includes("worker")) {
          // CSP issue - just mark as uploaded and let user skip
          setIdVerificationStatus("failed");
          setError(
            language === "ar"
              ? "تم تحميل الصورة. انقر على 'تخطي' للمتابعة"
              : "Image uploaded. Click 'Skip' to continue"
          );
        } else {
          setIdVerificationStatus("failed");
          setError(
            language === "ar"
              ? "فشل في قراءة الهوية. يمكنك النقر على 'تخطي' للمتابعة"
              : "Failed to read ID. You can click 'Skip' to continue"
          );
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Camera functionality
  const startCamera = useCallback(async () => {
    try {
      console.warn("Starting camera...");
      console.warn("Video ref current:", videoRef.current);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      console.warn("Got media stream:", stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        console.warn("Camera started successfully");
      } else {
        console.error("Video ref not available");
        // Try again after a short delay
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
            console.warn("Camera started successfully on retry");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setError(
        language === "ar" ? "فشل الوصول للكاميرا" : "Failed to access camera"
      );
    }
  }, [language]);

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context?.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL("image/jpeg");
      setCapturedPhoto(photoData);

      // Stop camera
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);

      // Simulate face verification (in a real app, you'd use face-api.js or similar)
      setError("");
      setTimeout(() => {
        // Simulate random verification result for demo
        const isMatched = Math.random() > 0.3; // 70% success rate for demo

        if (isMatched) {
          setError("");
        } else {
          setError(
            language === "ar"
              ? "فشل في التحقق من الوجه. يرجى المحاولة مرة أخرى أو تخطي هذه الخطوة"
              : "Face verification failed. Please try again or skip this step"
          );
        }
      }, 2000);
    }
  };

  // NHS Email verification
  const sendNhsVerificationCode = async () => {
    if (
      !registrationData.email.trim() ||
      !registrationData.email.includes("@nhs.net")
    ) {
      setError(
        language === "ar"
          ? "يرجى إدخال بريد إلكتروني صالح من NHS"
          : "Please enter a valid NHS email"
      );
      return;
    }

    setNhsEmailVerificationStatus("verifying");
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tfa",
          email: registrationData.email,
          code: "451452", // Fixed code for now
          name: `${registrationData.firstName} ${registrationData.lastName}`,
        }),
      });

      if (response.ok) {
        setNhsEmailVerificationStatus("verified");
        setCurrentPage("tfa");
        setIsResendDisabled(true);
        setResendCountdown(59);

        // Start countdown
        const interval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              setIsResendDisabled(false);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setNhsEmailVerificationStatus("failed");
        setError(
          language === "ar"
            ? "فشل إرسال رمز التحقق"
            : "Failed to send verification code"
        );
      }
    } catch {
      setNhsEmailVerificationStatus("failed");
      setError(
        language === "ar"
          ? "فشل إرسال رمز التحقق"
          : "Failed to send verification code"
      );
    }
  };

  // 2FA Code handling
  const handleTfaCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...tfaCode];
      newCode[index] = value;
      setTfaCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`tfa-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-verify when all 6 digits are entered (always pass)
      if (newCode.every((digit) => digit !== "")) {
        setTfaVerificationStatus("verified");
        setTimeout(() => setCurrentPage("password"), 1000);
      }
    }
  };

  // Login handler
  const handleLogin = () => {
    if (!loginEmail.trim()) {
      setError(
        language === "ar"
          ? "يرجى إدخال البريد الإلكتروني"
          : "Please enter email"
      );
      return;
    }

    if (!loginPassword.trim()) {
      setError(
        language === "ar" ? "يرجى إدخال كلمة المرور" : "Please enter password"
      );
      return;
    }

    // For demo purposes, accept any email/password
    setError("");
    setIsLoginFlow(true);
    setCurrentPage("complete");
    console.warn("Login successful:", { email: loginEmail });
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim() || !forgotPasswordEmail.includes("@")) {
      setError(
        language === "ar"
          ? "يرجى إدخال بريد إلكتروني صحيح"
          : "Please enter a valid email address"
      );
      return;
    }

    setError("");

    try {
      // Call the send-email API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "password_reset",
          email: forgotPasswordEmail,
          resetLink: `${window.location.origin}/reset-password?token=demo-token`,
        }),
      });

      if (response.ok) {
        setError("");
        alert(
          language === "ar"
            ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
            : "Password reset link has been sent to your email"
        );
        setCurrentPage("login");
        setForgotPasswordEmail("");
      } else {
        setError(
          language === "ar"
            ? "فشل إرسال البريد الإلكتروني"
            : "Failed to send email"
        );
      }
    } catch {
      setError(
        language === "ar"
          ? "حدث خطأ في إرسال البريد الإلكتروني"
          : "Error sending email"
      );
    }
  };

  // Password validation and final registration
  const handleFinalRegistration = () => {
    if (registrationData.password !== registrationData.confirmPassword) {
      setError(
        language === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match"
      );
      return;
    }

    if (registrationData.password.length < 8) {
      setError(
        language === "ar"
          ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
          : "Password must be at least 8 characters"
      );
      return;
    }

    setCurrentPage("complete");

    // Log the registration data for future use
    console.warn("Registration completed:", registrationData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            {currentPage !== "choice" && currentPage !== initialPage && (
              <button
                onClick={() => {
                  setError(""); // Clear error when navigating back

                  // Handle navigation for login/forgot password flow
                  if (currentPage === "login") {
                    // If login was the initial page, close modal; otherwise go to choice
                    if (initialPage === "login") {
                      onClose();
                    } else {
                      setCurrentPage("choice");
                    }
                  } else if (currentPage === "forgot_password") {
                    setCurrentPage("login");
                  } else if (currentPage === "role") {
                    // If role was the initial page, close modal; otherwise go to choice
                    if (initialPage === "role") {
                      onClose();
                    } else {
                      setCurrentPage("choice");
                    }
                  } else if (registrationData.role === "uk_specialist") {
                    const ukPages = [
                      "role",
                      "gmc",
                      "id",
                      "camera",
                      "nhs_email",
                      "tfa",
                      "password",
                      "complete",
                    ];
                    const currentIndex = ukPages.indexOf(currentPage);
                    if (currentIndex > 0) {
                      setCurrentPage(ukPages[currentIndex - 1] as any);
                    }
                  } else {
                    const gazaPages = [
                      "role",
                      "referral",
                      "gaza_email",
                      "complete",
                    ];
                    const currentIndex = gazaPages.indexOf(currentPage);
                    if (currentIndex > 0) {
                      setCurrentPage(gazaPages[currentIndex - 1] as any);
                    }
                  }
                }}
                className="p-1 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentPage === "login"
                ? language === "ar"
                  ? "تسجيل الدخول"
                  : "Login"
                : currentPage === "forgot_password"
                  ? language === "ar"
                    ? "استرجاع كلمة المرور"
                    : "Forgot Password"
                  : currentPage === "choice"
                    ? language === "ar"
                      ? "مرحباً بك"
                      : "Welcome"
                    : language === "ar"
                      ? "إنشاء حساب جديد"
                      : "Create Account"}
            </h2>
          </div>
          <button
            onClick={() => {
              setError(""); // Clear error when closing modal
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress indicator - Only show for registration, not login */}
        {registrationData.role === "uk_specialist" &&
          !["role", "complete", "choice", "login", "forgot_password"].includes(
            currentPage
          ) && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>GMC</span>
                <span>ID</span>
                <span>Photo</span>
                <span>Email</span>
                <span>2FA</span>
                <span>Password</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(["gmc", "id", "camera", "nhs_email", "tfa", "password"].indexOf(currentPage) + 1) * 16.67}%`,
                  }}
                />
              </div>
            </div>
          )}

        {/* Progress indicator for Gaza clinicians */}
        {registrationData.role === "gaza_clinician" &&
          !["role", "complete", "choice", "login", "forgot_password"].includes(
            currentPage
          ) && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>{language === "ar" ? "رمز الإحالة" : "Referral"}</span>
                <span>{language === "ar" ? "البريد الإلكتروني" : "Email"}</span>
                <span>{language === "ar" ? "كلمة المرور" : "Password"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(["referral", "gaza_email"].indexOf(currentPage) + 1) * 33.33}%`,
                  }}
                />
              </div>
            </div>
          )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Choice Page - Login or Register */}
          {currentPage === "choice" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {language === "ar"
                    ? "مرحباً بك في منصة جسور الطبية"
                    : "Welcome to Jusur Medical Platform"}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon className="h-5 w-5" />
                  {language === "ar" ? "تسجيل الدخول" : "Login"}
                </button>

                <button
                  onClick={() => setCurrentPage("role")}
                  className="w-full bg-green-950 text-white py-3 rounded-lg hover:bg-green-900 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  {language === "ar" ? "إنشاء حساب جديد" : "Create New Account"}
                </button>
              </div>
            </div>
          )}

          {/* Login Page */}
          {currentPage === "login" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "your.email@example.com"
                      : "your.email@example.com"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar" ? "أدخل كلمة المرور" : "Enter password"
                  }
                />
              </div>

              <div className="text-right">
                <button
                  onClick={() => setCurrentPage("forgot_password")}
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  {language === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
              >
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {language === "ar"
                    ? "ليس لديك حساب؟ "
                    : "Don't have an account? "}
                </span>
                <button
                  onClick={() => setCurrentPage("role")}
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  {language === "ar" ? "إنشاء حساب جديد" : "Create one"}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Page */}
          {currentPage === "forgot_password" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور"
                  : "Enter your email and we'll send you a link to reset your password"}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "your.email@example.com"
                      : "your.email@example.com"
                  }
                />
              </div>

              <button
                onClick={handleForgotPassword}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
              >
                {language === "ar"
                  ? "إرسال رابط إعادة التعيين"
                  : "Send Reset Link"}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setCurrentPage("login")}
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  {language === "ar" ? "العودة لتسجيل الدخول" : "Back to login"}
                </button>
              </div>
            </div>
          )}

          {/* Role Selection Page */}
          {currentPage === "role" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === "ar" ? "تسجيل حساب جديد" : "Create New Account"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === "ar"
                    ? "للانضمام كطبيب متطوع، يرجى إكمال عملية التسجيل والتحقق من هويتك."
                    : "To join as a volunteer clinician, please complete the registration and identity verification process."}
                </p>
              </div>

              {/* UK Specialist Info Boxes */}
              <div className="space-y-4">
                {/* What you'll need section */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                    {language === "ar"
                      ? "ما ستحتاجه للتسجيل (أخصائي بريطاني):"
                      : "What you'll need for registration (UK Specialist):"}
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                      {language === "ar"
                        ? "رقم GMC الخاص بك (رقم التسجيل الطبي العام)"
                        : "Your GMC number (General Medical Council registration)"}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                      {language === "ar"
                        ? "صورة واضحة من صفحة الصورة في جواز السفر"
                        : "Clear photo of your passport photo page"}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                      {language === "ar"
                        ? "كاميرا للتحقق من الهوية (صورة حية)"
                        : "Camera for live identity verification"}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                      {language === "ar"
                        ? "عنوان بريد إلكتروني صالح للتحقق"
                        : "Valid email address for verification"}
                    </li>
                  </ul>
                </div>

                {/* Registration process section */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                    {language === "ar"
                      ? "عملية التسجيل (5 خطوات):"
                      : "Registration Process (5 Steps):"}
                  </h4>
                  <ol className="text-sm text-green-700 dark:text-green-300 space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        {language === "ar"
                          ? "التحقق من رقم GMC"
                          : "GMC Number Verification"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        {language === "ar"
                          ? "رفع صورة جواز السفر"
                          : "Passport Photo Upload"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        {language === "ar"
                          ? "التحقق من الهوية بالكاميرا"
                          : "Live Face Verification"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        {language === "ar"
                          ? "التحقق من البريد الإلكتروني"
                          : "Email Verification"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        5
                      </span>
                      <span>
                        {language === "ar"
                          ? "إنشاء كلمة المرور"
                          : "Account Setup"}
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === "ar"
                    ? "اختر نوع الحساب"
                    : "Select Account Type"}
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="uk_specialist"
                      checked={registrationData.role === "uk_specialist"}
                      onChange={(e) =>
                        setRegistrationData((prev) => ({
                          ...prev,
                          role: e.target.value as any,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg transition-all ${
                        registrationData.role === "uk_specialist"
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"
                      }`}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {language === "ar" ? "أخصائي بريطاني" : "UK Specialist"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {language === "ar"
                          ? "للأطباء المختصين في المملكة المتحدة"
                          : "For medical specialists in the UK"}
                      </p>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="gaza_clinician"
                      checked={registrationData.role === "gaza_clinician"}
                      onChange={(e) =>
                        setRegistrationData((prev) => ({
                          ...prev,
                          role: e.target.value as any,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg transition-all ${
                        registrationData.role === "gaza_clinician"
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"
                      }`}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {language === "ar" ? "طبيب غزة" : "Gaza Clinician"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {language === "ar"
                          ? "للأطباء في قطاع غزة"
                          : "For doctors in Gaza Strip"}
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => {
                    setError(""); // Clear error when moving forward
                    if (registrationData.role === "uk_specialist") {
                      setCurrentPage("gmc");
                    } else {
                      setCurrentPage("referral");
                    }
                  }}
                  className="w-full bg-green-600 text-white mt-5  py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
                >
                  {language === "ar" ? "متابعة" : "Continue"}
                </button>
              </div>
            </div>
          )}

          {/* GMC Verification Page */}
          {currentPage === "gmc" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "تحقق من رقم GMC" : "GMC Verification"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "رقم GMC" : "GMC Number"}
                </label>
                <input
                  type="text"
                  value={registrationData.gmcNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and limit to 7 digits
                    if (/^\d{0,7}$/.test(value)) {
                      setRegistrationData((prev) => ({
                        ...prev,
                        gmcNumber: value,
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder="e.g., 1234567"
                  maxLength={7}
                />
              </div>

              {gmcVerificationStatus === "verified" && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    ✓{" "}
                    {language === "ar"
                      ? "تم التحقق من GMC بنجاح"
                      : "GMC verified successfully"}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    <strong>
                      {registrationData.firstName} {registrationData.lastName}
                    </strong>
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {registrationData.institution}
                  </p>
                  {registrationData.yearsOfExperience && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {language === "ar"
                        ? "سنوات الخبرة:"
                        : "Years of Experience:"}{" "}
                      {registrationData.yearsOfExperience}
                    </p>
                  )}
                  {registrationData.specialties &&
                    registrationData.specialties.length > 0 && (
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {language === "ar" ? "التخصصات:" : "Specialties:"}{" "}
                        {registrationData.specialties.join(", ")}
                      </p>
                    )}
                </div>
              )}

              <button
                onClick={() => {
                  if (gmcVerificationStatus === "verified") {
                    setError(""); // Clear error when moving forward
                    setCurrentPage("id");
                  } else {
                    verifyGMC();
                  }
                }}
                disabled={
                  gmcVerificationStatus === "verifying" ||
                  (gmcVerificationStatus !== "verified" &&
                    registrationData.gmcNumber.length !== 7)
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {gmcVerificationStatus === "verifying"
                  ? language === "ar"
                    ? "جاري التحقق..."
                    : "Verifying..."
                  : gmcVerificationStatus === "verified"
                    ? language === "ar"
                      ? "التالي"
                      : "Next"
                    : language === "ar"
                      ? "تحقق من GMC"
                      : "Verify GMC"}
              </button>
            </div>
          )}

          {/* ID Verification Page */}
          {currentPage === "id" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "تحقق من الهوية" : "ID Verification"}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "قم برفع صورة من هويتك الشخصية لتأكيد اسمك"
                  : "Upload a photo of your ID to confirm your name"}
              </p>

              {uploadedIdImage && (
                <div className="mt-4">
                  <img
                    src={uploadedIdImage}
                    alt="Uploaded ID"
                    className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {idVerificationStatus === "verified" && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    ✓{" "}
                    {language === "ar"
                      ? "تم التحقق من الهوية بنجاح"
                      : "ID verified successfully"}
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleIdUpload}
                className="hidden"
                id="id-upload"
              />

              <div className="space-y-3">
                {idVerificationStatus === "verified" ? (
                  <button
                    onClick={() => setCurrentPage("camera")}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <span>{language === "ar" ? "التالي" : "Next"}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <label
                    htmlFor="id-upload"
                    className={`w-full block text-center py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                      idVerificationStatus === "verified"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {idVerificationStatus === "verifying"
                      ? language === "ar"
                        ? "جاري التحقق..."
                        : "Verifying..."
                      : language === "ar"
                        ? "رفع صورة الهوية"
                        : "Upload ID Photo"}
                  </label>
                )}

                {/* Skip button - only show when there's a failure or after upload attempt */}
                {(idVerificationStatus === "failed" || uploadedIdImage) &&
                  idVerificationStatus !== "verified" && (
                    <button
                      onClick={() => {
                        setError("");
                        setIdVerificationStatus("verified");
                        setTimeout(() => setCurrentPage("camera"), 1000);
                      }}
                      className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                    >
                      {language === "ar"
                        ? "تخطي التحقق من الهوية"
                        : "Skip ID Verification"}
                    </button>
                  )}
              </div>
            </div>
          )}

          {/* Camera Page */}
          {currentPage === "camera" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "التحقق من الوجه" : "Facial Verification"}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "التقط صورة واضحة لوجهك للتحقق"
                  : "Take a clear photo of your face for verification"}
              </p>

              {!capturedPhoto && (
                <div className="space-y-3">
                  <div className="relative">
                    {isCameraActive ? (
                      <div className="relative">
                        <div className="relative w-full max-w-sm mx-auto">
                          <video
                            ref={videoRef}
                            autoPlay
                            className="w-full rounded-lg"
                            style={{ maxHeight: "400px" }}
                          />
                          {/* Face guide overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="relative w-full h-full">
                              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg" />
                              <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-4 border-white rounded-full"
                                style={{
                                  background:
                                    "radial-gradient(ellipse at center, transparent 0%, transparent 100%)",
                                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.3)",
                                }}
                              ></div>
                              <p className="absolute top-4 left-0 right-0 text-center text-white text-sm font-medium">
                                {language === "ar"
                                  ? "ضع وجهك داخل الإطار"
                                  : "Position your face within the frame"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={capturePhoto}
                            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                          >
                            <CameraIcon className="h-5 w-5" />
                            <span>
                              {language === "ar"
                                ? "التقاط صورة"
                                : "Capture Photo"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-6 text-center">
                          <CameraIcon className="h-12 w-12 text-gray-500 dark:text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {language === "ar"
                              ? "نحتاج إلى التقاط صورة لوجهك للتحقق من هويتك"
                              : "We need to capture a photo of your face for identity verification"}
                          </p>
                          <button
                            onClick={startCamera}
                            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
                          >
                            <CameraIcon className="h-5 w-5" />
                            <span>
                              {language === "ar"
                                ? "تشغيل الكاميرا"
                                : "Enable Camera"}
                            </span>
                          </button>
                        </div>
                        {error && (
                          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {error}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Skip button for camera */}
                  <button
                    onClick={() => {
                      setError("");
                      setCurrentPage("nhs_email");
                    }}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                  >
                    {language === "ar"
                      ? "تخطي التحقق من الصورة"
                      : "Skip Photo Verification"}
                  </button>
                </div>
              )}

              {capturedPhoto && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {language === "ar"
                        ? "تم التقاط الصورة بنجاح"
                        : "Photo captured successfully"}
                    </p>
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setCapturedPhoto(null);
                        setError("");
                        startCamera();
                      }}
                      className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CameraIcon className="h-5 w-5" />
                      <span>
                        {language === "ar" ? "إعادة التقاط" : "Retake"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        // Always pass verification
                        setError("");
                        setCurrentPage("nhs_email");
                      }}
                      className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{language === "ar" ? "تحقق" : "Verify"}</span>
                    </button>
                  </div>

                  {error && (
                    <div className="space-y-3">
                      <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {error}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setError("");
                          setCurrentPage("nhs_email");
                        }}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        {language === "ar" ? "تخطي" : "Skip"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}

          {/* NHS Email Page */}
          {currentPage === "nhs_email" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "بريد NHS الإلكتروني" : "NHS Email"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar"
                    ? "بريد NHS الإلكتروني"
                    : "NHS Email Address"}
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder="your.name@nhs.net"
                />
              </div>

              {nhsEmailVerificationStatus === "verified" && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    ✓{" "}
                    {language === "ar"
                      ? "تم إرسال رمز التحقق"
                      : "Verification code sent"}
                  </p>
                </div>
              )}

              <button
                onClick={sendNhsVerificationCode}
                disabled={
                  nhsEmailVerificationStatus === "verifying" ||
                  !registrationData.email.includes("@nhs.net")
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {nhsEmailVerificationStatus === "verifying"
                  ? language === "ar"
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : language === "ar"
                    ? "إرسال رمز التحقق"
                    : "Send Verification Code"}
              </button>

              {/* Skip button for failed verification */}
              {error && error.includes("Failed to send verification code") && (
                <button
                  onClick={() => {
                    setError("");
                    setCurrentPage("tfa");
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                >
                  {language === "ar" ? "تخطي التحقق" : "Skip Verification"}
                </button>
              )}
            </div>
          )}

          {/* 2FA Code Page */}
          {currentPage === "tfa" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "رمز التحقق" : "Verification Code"}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? `تم إرسال رمز التحقق إلى ${registrationData.email}`
                  : `Verification code sent to ${registrationData.email}`}
              </p>

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {tfaCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`tfa-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      value={digit}
                      onChange={(e) =>
                        handleTfaCodeChange(index, e.target.value)
                      }
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === "Backspace" && !digit && index > 0) {
                          const prevInput = document.getElementById(
                            `tfa-${index - 1}`
                          );
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-zinc-800 dark:text-white transition-all"
                      maxLength={1}
                    />
                  ))}
                </div>

                {/* Timer display */}
                {isResendDisabled && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === "ar"
                        ? `يمكنك إعادة إرسال الرمز في ${resendCountdown} ثانية`
                        : `You can resend code in ${resendCountdown} seconds`}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${((59 - resendCountdown) / 59) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {tfaVerificationStatus === "verified" && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {language === "ar"
                      ? "تم التحقق من الرمز بنجاح"
                      : "Code verified successfully"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={sendNhsVerificationCode}
                  disabled={isResendDisabled}
                  className="bg-zinc-950 text-white py-3 rounded-lg hover:bg-zinc-950/50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>
                    {isResendDisabled
                      ? `${resendCountdown}s`
                      : language === "ar"
                        ? "إعادة إرسال"
                        : "Resend"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setError("");
                    setCurrentPage("password");
                  }}
                  className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                >
                  {language === "ar" ? "تخطي" : "Skip"}
                </button>
              </div>
            </div>
          )}

          {/* Password Page */}
          {currentPage === "password" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "إنشاء كلمة مرور" : "Create Password"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                  type="password"
                  value={registrationData.password}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "8 أحرف على الأقل"
                      : "At least 8 characters"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                </label>
                <input
                  type="password"
                  value={registrationData.confirmPassword}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "أعد كتابة كلمة المرور"
                      : "Re-enter password"
                  }
                />
              </div>

              <button
                onClick={handleFinalRegistration}
                disabled={
                  !registrationData.password ||
                  registrationData.password !== registrationData.confirmPassword
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {language === "ar" ? "إنشاء الحساب" : "Create Account"}
              </button>
            </div>
          )}

          {/* Gaza Clinician - Referral Code Page */}
          {currentPage === "referral" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "رمز الإحالة" : "Referral Code"}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "أدخل رمز الإحالة المقدم من قبل منسق البرنامج"
                  : "Enter the referral code provided by the program coordinator"}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "رمز الإحالة" : "Referral Code"}
                </label>
                <input
                  type="text"
                  value={registrationData.referralCode}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      referralCode: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "أدخل رمز الإحالة"
                      : "Enter referral code"
                  }
                />
              </div>

              <button
                onClick={() => {
                  if (!registrationData.referralCode.trim()) {
                    setError(
                      language === "ar"
                        ? "يرجى إدخال رمز الإحالة"
                        : "Please enter referral code"
                    );
                    return;
                  }
                  if (registrationData.referralCode !== "DeenDevelopers") {
                    setError(
                      language === "ar"
                        ? "رمز الإحالة غير صحيح"
                        : "Invalid referral code"
                    );
                    return;
                  }
                  setError("");
                  setCurrentPage("gaza_email");
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
              >
                {language === "ar" ? "متابعة" : "Continue"}
              </button>
            </div>
          )}

          {/* Gaza Clinician - Email and Password Page */}
          {currentPage === "gaza_email" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {language === "ar" ? "إنشاء حساب" : "Create Account"}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "أدخل البريد الإلكتروني"
                      : "Enter email address"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                  type="password"
                  value={registrationData.password}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "8 أحرف على الأقل"
                      : "At least 8 characters"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                </label>
                <input
                  type="password"
                  value={registrationData.confirmPassword}
                  onChange={(e) =>
                    setRegistrationData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                  placeholder={
                    language === "ar"
                      ? "أعد كتابة كلمة المرور"
                      : "Re-enter password"
                  }
                />
              </div>

              <button
                onClick={() => {
                  if (!registrationData.email.trim()) {
                    setError(
                      language === "ar"
                        ? "يرجى إدخال البريد الإلكتروني"
                        : "Please enter email address"
                    );
                    return;
                  }
                  if (!registrationData.email.includes("@")) {
                    setError(
                      language === "ar"
                        ? "يرجى إدخال بريد إلكتروني صحيح"
                        : "Please enter a valid email address"
                    );
                    return;
                  }
                  if (!registrationData.password.trim()) {
                    setError(
                      language === "ar"
                        ? "يرجى إدخال كلمة المرور"
                        : "Please enter password"
                    );
                    return;
                  }
                  if (registrationData.password.length < 8) {
                    setError(
                      language === "ar"
                        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                        : "Password must be at least 8 characters"
                    );
                    return;
                  }
                  if (
                    registrationData.password !==
                    registrationData.confirmPassword
                  ) {
                    setError(
                      language === "ar"
                        ? "كلمات المرور غير متطابقة"
                        : "Passwords do not match"
                    );
                    return;
                  }
                  setError("");
                  // Set default names for Gaza clinicians since we're not collecting them
                  setRegistrationData((prev) => ({
                    ...prev,
                    firstName: "Gaza",
                    lastName: "Clinician",
                  }));
                  setCurrentPage("complete");

                  // Start 3-second countdown
                  setCompletionCountdown(3);

                  // Also log the registration data for future use
                  console.warn("Registration completed:", registrationData);
                }}
                disabled={
                  !registrationData.email ||
                  !registrationData.password ||
                  registrationData.password !== registrationData.confirmPassword
                }
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {language === "ar" ? "إنشاء الحساب" : "Create Account"}
              </button>
            </div>
          )}

          {/* Completion Page */}
          {currentPage === "complete" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isLoginFlow
                  ? language === "ar"
                    ? "تم تسجيل الدخول بنجاح!"
                    : "Login Successful!"
                  : language === "ar"
                    ? "تم إنشاء الحساب بنجاح!"
                    : "Account Created Successfully!"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "مرحباً بك في منصة جسور الطبية"
                  : "Welcome to Jusur Medical Platform"}
              </p>
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-lg font-medium text-green-800 dark:text-green-200">
                  {language === "ar"
                    ? `جاري الانتقال إلى التطبيق في ${completionCountdown}${".".repeat(completionCountdown)}`
                    : `Redirecting to app in ${completionCountdown}${".".repeat(completionCountdown)}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
