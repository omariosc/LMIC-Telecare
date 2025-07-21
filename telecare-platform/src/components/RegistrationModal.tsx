"use client";

import React, { useState, useEffect, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pendingRequests: Array<Partial<any> & { id: string }>;
  reviewedRequests: Array<any>;
  setPendingRequests: (_requests: Array<Partial<any> & { id: string }>) => void;
  setReviewedRequests: (_requests: Array<any>) => void;
  language: "en" | "ar";
};

export default function RegistrationModal({
  isOpen,
  onClose,
  pendingRequests,
  reviewedRequests,
  setPendingRequests,
  setReviewedRequests,
  language,
}: RegistrationModalProps) {
  const [registrationStep, setRegistrationStep] = useState(1);
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
  const [registrationError, setRegistrationError] = useState("");
  const [isVerifyingGMC, setIsVerifyingGMC] = useState(false);
  const [gmcVerificationStatus, setGmcVerificationStatus] = useState<
    "pending" | "verified" | "failed"
  >("pending");

  // ID verification states
  const [_idImage, setIdImage] = useState<File | null>(null);
  const [idImagePreview, setIdImagePreview] = useState<string | null>(null);
  const [isVerifyingID, setIsVerifyingID] = useState(false);
  const [idVerificationStatus, setIdVerificationStatus] = useState<
    "pending" | "verified" | "failed"
  >("pending");
  const [extractedNames, setExtractedNames] = useState<string[]>([]);

  // Face verification states
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [isCapturingFace, setIsCapturingFace] = useState(false);
  const [faceVerificationStatus, setFaceVerificationStatus] = useState<
    "pending" | "verified" | "failed"
  >("pending");

  // NHS email verification states
  const [nhsEmail, setNhsEmail] = useState("");
  const [isVerifyingNHS, setIsVerifyingNHS] = useState(false);
  const [nhsVerificationStatus, setNhsVerificationStatus] = useState<
    "pending" | "code_sent" | "verified" | "failed"
  >("pending");
  const [tfaCode, setTfaCode] = useState("");

  // Gaza clinician email verification states
  const [isVerifyingGazaEmail, setIsVerifyingGazaEmail] = useState(false);
  const [gazaEmailVerificationStatus, setGazaEmailVerificationStatus] =
    useState<"pending" | "code_sent" | "verified" | "failed">("pending");
  const [gazaTfaCode, setGazaTfaCode] = useState("");

  // Clear error messages and reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRegistrationError("");
      setRegistrationStep(1);
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
    }
  }, [isOpen]);

  // GMC verification function
  const verifyGMCNumber = useCallback(
    async (gmcNumber: string) => {
      setIsVerifyingGMC(true);
      setRegistrationError("");
      setGmcVerificationStatus("pending");

      try {
        const response = await fetch(`/api/fetchGmcName?gmc=${gmcNumber}`);
        const data = await response.json();

        if (!response.ok || data.error) {
          setRegistrationError(
            language === "ar" ? "رقم GMC غير صحيح" : "Invalid GMC"
          );
          setGmcVerificationStatus("failed");
          return;
        }

        // Update registration data with extracted information
        setRegistrationData((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          institution: data.institution,
          yearsOfExperience: data.yearsOfExperience,
          specialties: data.specialties,
        }));

        setGmcVerificationStatus("verified");
      } catch (error) {
        console.error("GMC verification failed:", error);
        setRegistrationError(
          language === "ar"
            ? "فشل في التحقق من رقم GMC"
            : "Failed to verify GMC number"
        );
        setGmcVerificationStatus("failed");
      } finally {
        setIsVerifyingGMC(false);
      }
    },
    [language]
  );

  // Trigger GMC verification when a valid 7-digit number is entered
  React.useEffect(() => {
    if (
      registrationData.role === "uk_specialist" &&
      /^\d{7}$/.test(registrationData.gmcNumber) &&
      gmcVerificationStatus === "pending"
    ) {
      verifyGMCNumber(registrationData.gmcNumber);
    }
  }, [
    registrationData.gmcNumber,
    registrationData.role,
    gmcVerificationStatus,
    verifyGMCNumber,
  ]);

  // ID verification with OCR
  const verifyIDDocument = async (file: File) => {
    setIsVerifyingID(true);
    setRegistrationError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/verify-id", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify ID");
      }

      setExtractedNames(data.extractedNames || []);

      // Check if any GMC names match extracted names
      const gmcNames = [
        registrationData.firstName,
        registrationData.lastName,
      ].filter((name) => name);
      const hasMatch = gmcNames.some((gmcName) =>
        data.extractedNames?.some(
          (extractedName: string) =>
            extractedName.toLowerCase().includes(gmcName.toLowerCase()) ||
            gmcName.toLowerCase().includes(extractedName.toLowerCase())
        )
      );

      if (hasMatch) {
        setIdVerificationStatus("verified");
      } else {
        setIdVerificationStatus("failed");
        setRegistrationError(
          language === "ar"
            ? "لم يتم العثور على تطابق في الأسماء مع وثيقة الهوية"
            : "No name match found in ID document"
        );
      }
    } catch (error) {
      console.error("ID verification failed:", error);
      setIdVerificationStatus("failed");
      setRegistrationError(
        language === "ar"
          ? "فشل في التحقق من وثيقة الهوية"
          : "Failed to verify ID document"
      );
    } finally {
      setIsVerifyingID(false);
    }
  };

  // Face capture and verification
  const captureFace = async () => {
    setIsCapturingFace(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0);

        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setFaceImage(imageDataUrl);

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop());

        // Hardcoded to pass as requested
        setFaceVerificationStatus("verified");
        setIsCapturingFace(false);
      };
    } catch (error) {
      console.error("Face capture failed:", error);
      setRegistrationError(
        language === "ar" ? "فشل في التقاط الصورة" : "Failed to capture image"
      );
      setIsCapturingFace(false);
    }
  };

  // NHS email verification
  const verifyNHSEmail = async (email: string) => {
    setIsVerifyingNHS(true);
    setRegistrationError("");

    if (!email.endsWith("@nhs.net")) {
      setRegistrationError(
        language === "ar"
          ? "يجب أن ينتهي البريد الإلكتروني بـ @nhs.net"
          : "Email must end with @nhs.net"
      );
      setNhsVerificationStatus("failed");
      setIsVerifyingNHS(false);
      return;
    }

    try {
      // Generate 6-digit code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Send email with 2FA code
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "tfa",
          email: email,
          code: verificationCode,
          name: `${registrationData.firstName} ${registrationData.lastName}`.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }

      // Store the code for verification (in production, this would be stored server-side)
      sessionStorage.setItem("verification_code", verificationCode);
      sessionStorage.setItem("verification_email", email);

      setNhsVerificationStatus("code_sent");
    } catch (error) {
      console.error("Failed to send verification email:", error);
      setRegistrationError(
        language === "ar"
          ? "فشل في إرسال رمز التحقق"
          : "Failed to send verification code"
      );
      setNhsVerificationStatus("failed");
    } finally {
      setIsVerifyingNHS(false);
    }
  };

  // 2FA verification for NHS email
  const verify2FA = (code: string) => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setRegistrationError(
        language === "ar"
          ? "الرمز يجب أن يكون 6 أرقام"
          : "Code must be 6 digits"
      );
      return;
    }

    // Check against stored verification code
    const storedCode = sessionStorage.getItem("verification_code");
    const storedEmail = sessionStorage.getItem("verification_email");

    if (storedCode === code && storedEmail === nhsEmail) {
      setNhsVerificationStatus("verified");
      setRegistrationError("");
      // Clean up stored code
      sessionStorage.removeItem("verification_code");
      sessionStorage.removeItem("verification_email");
    } else {
      setRegistrationError(
        language === "ar" ? "رمز التحقق غير صحيح" : "Invalid verification code"
      );
    }
  };

  // Gaza email verification
  const verifyGazaEmail = async (email: string) => {
    setIsVerifyingGazaEmail(true);
    setRegistrationError("");

    if (!email.trim()) {
      setRegistrationError(
        language === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required"
      );
      setGazaEmailVerificationStatus("failed");
      setIsVerifyingGazaEmail(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegistrationError(
        language === "ar"
          ? "البريد الإلكتروني غير صحيح"
          : "Invalid email address"
      );
      setGazaEmailVerificationStatus("failed");
      setIsVerifyingGazaEmail(false);
      return;
    }

    try {
      // Generate 6-digit code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Send email with 2FA code
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "tfa",
          email: email,
          code: verificationCode,
          name: `${registrationData.firstName} ${registrationData.lastName}`.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification email");
      }

      // Store the code for verification (in production, this would be stored server-side)
      sessionStorage.setItem("gaza_verification_code", verificationCode);
      sessionStorage.setItem("gaza_verification_email", email);

      setGazaEmailVerificationStatus("code_sent");
    } catch (error) {
      console.error("Failed to send verification email:", error);
      setRegistrationError(
        language === "ar"
          ? "فشل في إرسال رمز التحقق"
          : "Failed to send verification code"
      );
      setGazaEmailVerificationStatus("failed");
    } finally {
      setIsVerifyingGazaEmail(false);
    }
  };

  // 2FA verification for Gaza email
  const verifyGaza2FA = (code: string) => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setRegistrationError(
        language === "ar"
          ? "الرمز يجب أن يكون 6 أرقام"
          : "Code must be 6 digits"
      );
      return;
    }

    // Check against stored verification code
    const storedCode = sessionStorage.getItem("gaza_verification_code");
    const storedEmail = sessionStorage.getItem("gaza_verification_email");

    if (storedCode === code && storedEmail === registrationData.email) {
      setGazaEmailVerificationStatus("verified");
      setRegistrationError("");
      // Clean up stored code
      sessionStorage.removeItem("gaza_verification_code");
      sessionStorage.removeItem("gaza_verification_email");
    } else {
      setRegistrationError(
        language === "ar" ? "رمز التحقق غير صحيح" : "Invalid verification code"
      );
    }
  };

  const handleRegistrationNext = () => {
    if (registrationStep === 1) {
      if (registrationData.role === "uk_specialist") {
        // Validate GMC number for UK specialists
        if (!registrationData.gmcNumber.trim()) {
          setRegistrationError(
            language === "ar" ? "رقم GMC مطلوب" : "GMC number is required"
          );
          return;
        }
        if (!/^\d{7}$/.test(registrationData.gmcNumber)) {
          setRegistrationError(
            language === "ar"
              ? "رقم GMC يجب أن يكون 7 أرقام فقط"
              : "GMC number must be exactly 7 digits"
          );
          return;
        }
        if (gmcVerificationStatus !== "verified") {
          setRegistrationError(
            language === "ar"
              ? "يرجى انتظار التحقق من رقم GMC"
              : "Please wait for GMC verification to complete"
          );
          return;
        }
        if (idVerificationStatus !== "verified") {
          setRegistrationError(
            language === "ar"
              ? "يجب التحقق من وثيقة الهوية أولاً"
              : "ID document verification required"
          );
          return;
        }
        if (faceVerificationStatus !== "verified") {
          setRegistrationError(
            language === "ar"
              ? "يجب التحقق من صورة الوجه أولاً"
              : "Face verification required"
          );
          return;
        }
        if (nhsVerificationStatus !== "verified") {
          setRegistrationError(
            language === "ar"
              ? "يجب التحقق من بريد NHS الإلكتروني أولاً"
              : "NHS email verification required"
          );
          return;
        }
        // Validate password for UK specialists (shown after all verifications)
        if (!registrationData.password || !registrationData.confirmPassword) {
          setRegistrationError(
            language === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
          );
          return;
        }
        if (registrationData.password !== registrationData.confirmPassword) {
          setRegistrationError(
            language === "ar"
              ? "كلمات المرور غير متطابقة"
              : "Passwords do not match"
          );
          return;
        }
      } else if (registrationData.role === "gaza_clinician") {
        // Validate referral code for Gaza clinicians
        if (!registrationData.referralCode.trim()) {
          setRegistrationError(
            language === "ar"
              ? "رمز الإحالة مطلوب"
              : "Referral code is required"
          );
          return;
        }
        if (registrationData.referralCode !== "DeenDevelopers") {
          setRegistrationError(
            language === "ar" ? "رمز الإحالة غير صحيح" : "Invalid referral code"
          );
          return;
        }
        // Validate email verification for Gaza clinicians
        if (gazaEmailVerificationStatus !== "verified") {
          setRegistrationError(
            language === "ar"
              ? "يجب التحقق من البريد الإلكتروني أولاً"
              : "Email verification required"
          );
          return;
        }
        // Validate passwords for Gaza clinicians (shown after valid referral code)
        if (!registrationData.password || !registrationData.confirmPassword) {
          setRegistrationError(
            language === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
          );
          return;
        }
        if (registrationData.password !== registrationData.confirmPassword) {
          setRegistrationError(
            language === "ar"
              ? "كلمات المرور غير متطابقة"
              : "Passwords do not match"
          );
          return;
        }
      }
    }
    setRegistrationError("");
    setRegistrationStep(registrationStep + 1);
  };

  // const handleRegistrationBack = () => {
  //   setRegistrationStep(Math.max(1, registrationStep - 1));
  //   setRegistrationError("");
  // };

  const handleRegistrationSubmit = () => {
    // All validation is done in step 1 now
    // Just process the registration

    // Gaza clinicians with correct referral code get auto-approved
    const isGazaWithValidCode =
      registrationData.role === "gaza_clinician" &&
      registrationData.referralCode === "DeenDevelopers";

    const newRequest = {
      id: `pending_${Date.now()}`,
      ...registrationData,
      // For UK specialists, use NHS email as primary email
      email:
        registrationData.role === "uk_specialist"
          ? nhsEmail
          : registrationData.email,
      status: isGazaWithValidCode ? "verified" : "pending",
      createdAt: new Date().toISOString(),
    };

    if (isGazaWithValidCode) {
      // Auto-approve Gaza clinicians with correct referral code
      const reviewedRequest = {
        ...newRequest,
        decision: "approved" as const,
        reviewedAt: new Date().toISOString(),
        reviewedBy: "system_auto_approval",
        reviewNotes: "Auto-approved Gaza clinician with valid referral code",
      };

      const newReviewed = [...reviewedRequests, reviewedRequest];
      setReviewedRequests(newReviewed);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "reviewedRegistrations",
          JSON.stringify(newReviewed)
        );
      }

      onClose();
      alert(
        language === "ar"
          ? "تم تسجيل حسابك بنجاح! يمكنك الآن تسجيل الدخول."
          : "Account created successfully! You can now log in."
      );
    } else {
      // Add to pending requests for admin review
      const updatedPending = [...pendingRequests, newRequest];
      setPendingRequests(updatedPending);

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pendingRegistrations",
          JSON.stringify(updatedPending)
        );
      }

      onClose();
      alert(
        language === "ar"
          ? "تم إرسال طلب التسجيل بنجاح! سيتم مراجعته من قبل الإدارة."
          : "Registration request submitted successfully! It will be reviewed by admin."
      );
    }

    // Form will be reset automatically when modal closes and reopens
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-white dark:bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md ${
          language === "ar" ? "text-right" : "text-left"
        }`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div
          className={`flex justify-between items-center mb-6 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === "ar" ? "تسجيل حساب جديد" : "Register New Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Step 1: GMC Number and Role Selection */}
        {registrationStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === "ar" ? "نوع الحساب" : "Account Type"}
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label
                  className={`flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="uk_specialist"
                    checked={registrationData.role === "uk_specialist"}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        role: e.target.value as
                          | "uk_specialist"
                          | "gaza_clinician",
                      })
                    }
                    className={language === "ar" ? "ml-2" : "mr-2"}
                  />
                  <span className="text-sm dark:text-white">
                    {language === "ar" ? "أخصائي بريطاني" : "UK Specialist"}
                  </span>
                </label>
                <label
                  className={`flex items-center ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="gaza_clinician"
                    checked={registrationData.role === "gaza_clinician"}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        role: e.target.value as
                          | "uk_specialist"
                          | "gaza_clinician",
                      })
                    }
                    className={language === "ar" ? "ml-2" : "mr-2"}
                  />
                  <span className="text-sm dark:text-white">
                    {language === "ar" ? "طبيب غزة" : "Gaza Clinician"}
                  </span>
                </label>
              </div>
            </div>

            {registrationData.role === "uk_specialist" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "ar" ? "رقم GMC" : "GMC Number"}
                  </label>
                  <input
                    type="text"
                    value={registrationData.gmcNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                      setRegistrationData({
                        ...registrationData,
                        gmcNumber: value,
                      });
                      setGmcVerificationStatus("pending"); // Reset verification status
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                    placeholder={
                      language === "ar"
                        ? "أدخل رقم GMC (7 أرقام)"
                        : "Enter GMC number (7 digits)"
                    }
                    maxLength={7}
                  />
                </div>

                {/^\d{7}$/.test(registrationData.gmcNumber) && (
                  <>
                    {isVerifyingGMC && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          {language === "ar"
                            ? "جارٍ التحقق من رقم GMC..."
                            : "Verifying GMC number..."}
                        </p>
                      </div>
                    )}

                    {gmcVerificationStatus === "verified" && (
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                          {language === "ar"
                            ? "تم التحقق من رقم GMC بنجاح!"
                            : "GMC number verified successfully!"}
                        </p>
                        <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                          <p>
                            <strong>
                              {language === "ar" ? "الاسم:" : "Name:"}
                            </strong>{" "}
                            {registrationData.firstName}{" "}
                            {registrationData.lastName}
                          </p>
                          <p>
                            <strong>
                              {language === "ar" ? "المؤسسة:" : "Institution:"}
                            </strong>{" "}
                            {registrationData.institution}
                          </p>
                          <p>
                            <strong>
                              {language === "ar"
                                ? "سنوات الخبرة:"
                                : "Years of Experience:"}
                            </strong>{" "}
                            {registrationData.yearsOfExperience}
                          </p>
                          <p>
                            <strong>
                              {language === "ar" ? "التخصصات:" : "Specialties:"}
                            </strong>{" "}
                            {registrationData.specialties?.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    {gmcVerificationStatus === "failed" && (
                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          {language === "ar"
                            ? "فشل في التحقق من رقم GMC. يرجى التأكد من صحة الرقم."
                            : "Failed to verify GMC number. Please check the number is correct."}
                        </p>
                      </div>
                    )}

                    {/* ID Document Verification */}
                    {gmcVerificationStatus === "verified" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar"
                              ? "وثيقة الهوية (جواز السفر أو رخصة القيادة)"
                              : "ID Document (Passport or Driving License)"}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setIdImage(file);
                                const reader = new FileReader();
                                reader.onload = (e) =>
                                  setIdImagePreview(e.target?.result as string);
                                reader.readAsDataURL(file);
                                verifyIDDocument(file);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                          />
                          {idImagePreview && (
                            <div className="mt-2">
                              <img
                                src={idImagePreview}
                                alt="ID Preview"
                                className="w-32 h-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>

                        {isVerifyingID && (
                          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              {language === "ar"
                                ? "جارٍ التحقق من وثيقة الهوية..."
                                : "Verifying ID document..."}
                            </p>
                          </div>
                        )}

                        {idVerificationStatus === "verified" && (
                          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                              {language === "ar"
                                ? "تم التحقق من وثيقة الهوية بنجاح!"
                                : "ID document verified successfully!"}
                            </p>
                            {extractedNames.length > 0 && (
                              <p className="text-xs text-green-700 dark:text-green-300">
                                {language === "ar"
                                  ? "الأسماء المستخرجة:"
                                  : "Extracted names:"}{" "}
                                {extractedNames.join(", ")}
                              </p>
                            )}
                          </div>
                        )}

                        {idVerificationStatus === "failed" && (
                          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              {language === "ar"
                                ? "فشل في التحقق من وثيقة الهوية"
                                : "Failed to verify ID document"}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Face Verification */}
                    {idVerificationStatus === "verified" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar"
                              ? "التحقق من الوجه"
                              : "Face Verification"}
                          </label>
                          <button
                            type="button"
                            onClick={captureFace}
                            disabled={
                              isCapturingFace ||
                              faceVerificationStatus === "verified"
                            }
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCapturingFace
                              ? language === "ar"
                                ? "جارٍ التقاط الصورة..."
                                : "Capturing..."
                              : faceVerificationStatus === "verified"
                                ? language === "ar"
                                  ? "تم التحقق من الوجه"
                                  : "Face Verified"
                                : language === "ar"
                                  ? "التقاط صورة الوجه"
                                  : "Capture Face Photo"}
                          </button>
                          {faceImage && (
                            <div className="mt-2">
                              <img
                                src={faceImage}
                                alt="Face capture"
                                className="w-32 h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>

                        {faceVerificationStatus === "verified" && (
                          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              {language === "ar"
                                ? "تم التحقق من الوجه بنجاح!"
                                : "Face verification successful!"}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* NHS Email Verification */}
                    {faceVerificationStatus === "verified" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar"
                              ? "بريد NHS الإلكتروني"
                              : "NHS Email Address"}
                          </label>
                          <div
                            className={`flex gap-2 ${
                              language === "ar" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <input
                              type="email"
                              value={nhsEmail}
                              onChange={(e) => setNhsEmail(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                              placeholder={
                                language === "ar"
                                  ? "your.name@nhs.net"
                                  : "your.name@nhs.net"
                              }
                              disabled={nhsVerificationStatus === "verified"}
                            />
                            <button
                              type="button"
                              onClick={() => verifyNHSEmail(nhsEmail)}
                              disabled={
                                isVerifyingNHS ||
                                nhsVerificationStatus === "verified" ||
                                nhsVerificationStatus === "code_sent"
                              }
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isVerifyingNHS
                                ? language === "ar"
                                  ? "إرسال..."
                                  : "Sending..."
                                : nhsVerificationStatus === "code_sent"
                                  ? language === "ar"
                                    ? "تم الإرسال"
                                    : "Sent"
                                  : language === "ar"
                                    ? "إرسال"
                                    : "Send"}
                            </button>
                          </div>
                        </div>

                        {nhsVerificationStatus === "code_sent" && (
                          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                              {language === "ar"
                                ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
                                : "Verification code sent to your email"}
                            </p>
                            <div
                              className={`flex gap-2 ${
                                language === "ar" ? "flex-row-reverse" : ""
                              }`}
                            >
                              <input
                                type="text"
                                value={tfaCode}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  setTfaCode(value);
                                  if (value.length === 6) {
                                    verify2FA(value);
                                  }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                                placeholder={
                                  language === "ar"
                                    ? "أدخل الرمز (6 أرقام)"
                                    : "Enter code (6 digits)"
                                }
                                maxLength={6}
                              />
                            </div>
                          </div>
                        )}

                        {nhsVerificationStatus === "verified" && (
                          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              {language === "ar"
                                ? "تم التحقق من البريد الإلكتروني بنجاح!"
                                : "Email verification successful!"}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Password Fields - Only shown after all verifications */}
                    {nhsVerificationStatus === "verified" && (
                      <>
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                            {language === "ar"
                              ? "تم التحقق من جميع البيانات! يمكنك الآن إنشاء كلمة المرور"
                              : "All verifications complete! You can now create your password"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar" ? "كلمة المرور" : "Password"}
                          </label>
                          <input
                            type="password"
                            value={registrationData.password}
                            onChange={(e) =>
                              setRegistrationData({
                                ...registrationData,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar"
                              ? "تأكيد كلمة المرور"
                              : "Confirm Password"}
                          </label>
                          <input
                            type="password"
                            value={registrationData.confirmPassword}
                            onChange={(e) =>
                              setRegistrationData({
                                ...registrationData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                            required
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {registrationData.role === "gaza_clinician" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "ar" ? "رمز الإحالة" : "Referral Code"}
                  </label>
                  <input
                    type="text"
                    value={registrationData.referralCode}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        referralCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                    placeholder={
                      language === "ar"
                        ? "أدخل رمز الإحالة"
                        : "Enter referral code"
                    }
                  />
                </div>

                {registrationData.referralCode === "DeenDevelopers" && (
                  <>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {language === "ar"
                          ? "رمز الإحالة صحيح! يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل."
                          : "Valid referral code! Please verify your email to complete registration."}
                      </p>
                    </div>

                    {/* Email Verification for Gaza Clinicians */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "ar"
                          ? "البريد الإلكتروني"
                          : "Email Address"}
                      </label>
                      <div
                        className={`flex gap-2 ${
                          language === "ar" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <input
                          type="email"
                          value={registrationData.email}
                          onChange={(e) =>
                            setRegistrationData({
                              ...registrationData,
                              email: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                          placeholder={
                            language === "ar"
                              ? "أدخل البريد الإلكتروني"
                              : "Enter email address"
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            verifyGazaEmail(registrationData.email)
                          }
                          disabled={
                            isVerifyingGazaEmail ||
                            !registrationData.email.trim() ||
                            gazaEmailVerificationStatus === "verified"
                          }
                          className="px-4 py-2 bg-green-950 text-white rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isVerifyingGazaEmail
                            ? language === "ar"
                              ? "إرسال..."
                              : "Sending..."
                            : gazaEmailVerificationStatus === "verified"
                              ? language === "ar"
                                ? "تم التحقق"
                                : "Verified"
                              : language === "ar"
                                ? "إرسال رمز"
                                : "Send Code"}
                        </button>
                      </div>
                    </div>

                    {gazaEmailVerificationStatus === "code_sent" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {language === "ar"
                            ? "رمز التحقق"
                            : "Verification Code"}
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {language === "ar"
                            ? `تم إرسال رمز التحقق إلى ${registrationData.email}`
                            : `Verification code sent to ${registrationData.email}`}
                        </p>
                        <div
                          className={`flex gap-2 ${
                            language === "ar" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <input
                            type="text"
                            value={gazaTfaCode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setGazaTfaCode(value);
                              if (value.length === 6) {
                                verifyGaza2FA(value);
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                            placeholder={
                              language === "ar"
                                ? "أدخل الرمز (6 أرقام)"
                                : "Enter code (6 digits)"
                            }
                            maxLength={6}
                          />
                        </div>
                      </div>
                    )}

                    {gazaEmailVerificationStatus === "verified" && (
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          {language === "ar"
                            ? "تم التحقق من البريد الإلكتروني بنجاح!"
                            : "Email verification successful!"}
                        </p>
                      </div>
                    )}

                    {/* Password Fields - Only shown after email verification */}
                    {gazaEmailVerificationStatus === "verified" && (
                      <>
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                            {language === "ar"
                              ? "تم التحقق من البريد الإلكتروني! يمكنك الآن إنشاء كلمة المرور"
                              : "Email verified! You can now create your password"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar" ? "كلمة المرور" : "Password"}
                          </label>
                          <input
                            type="password"
                            value={registrationData.password}
                            onChange={(e) =>
                              setRegistrationData({
                                ...registrationData,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                            placeholder={
                              language === "ar"
                                ? "أدخل كلمة المرور"
                                : "Enter password"
                            }
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === "ar"
                              ? "تأكيد كلمة المرور"
                              : "Confirm Password"}
                          </label>
                          <input
                            type="password"
                            value={registrationData.confirmPassword}
                            onChange={(e) =>
                              setRegistrationData({
                                ...registrationData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-white"
                            placeholder={
                              language === "ar"
                                ? "تأكيد كلمة المرور"
                                : "Confirm password"
                            }
                            required
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {registrationError && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                {registrationError}
              </p>
            )}

            <div
              className={`flex gap-3 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={
                  (registrationData.role === "gaza_clinician" &&
                    registrationData.referralCode === "DeenDevelopers" &&
                    gazaEmailVerificationStatus === "verified") ||
                  (registrationData.role === "uk_specialist" &&
                    gmcVerificationStatus === "verified" &&
                    idVerificationStatus === "verified" &&
                    faceVerificationStatus === "verified" &&
                    nhsVerificationStatus === "verified")
                    ? handleRegistrationSubmit
                    : handleRegistrationNext
                }
                disabled={
                  isVerifyingGMC ||
                  isVerifyingID ||
                  isCapturingFace ||
                  isVerifyingNHS ||
                  isVerifyingGazaEmail
                }
                className="flex-1 bg-green-950 text-white py-2 px-4 rounded-lg hover:bg-green-900 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingGMC ||
                isVerifyingID ||
                isCapturingFace ||
                isVerifyingNHS ||
                isVerifyingGazaEmail
                  ? language === "ar"
                    ? "جارٍ التحقق..."
                    : "Verifying..."
                  : (registrationData.role === "gaza_clinician" &&
                        registrationData.referralCode === "DeenDevelopers" &&
                        gazaEmailVerificationStatus === "verified") ||
                      (registrationData.role === "uk_specialist" &&
                        gmcVerificationStatus === "verified" &&
                        idVerificationStatus === "verified" &&
                        faceVerificationStatus === "verified" &&
                        nhsVerificationStatus === "verified")
                    ? language === "ar"
                      ? "إنشاء حساب"
                      : "Create Account"
                    : language === "ar"
                      ? "التالي"
                      : "Next"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
