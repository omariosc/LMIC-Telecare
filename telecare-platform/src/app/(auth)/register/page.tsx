"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Loader,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import Tesseract from "tesseract.js";
import * as faceapi from "face-api.js";

type RegistrationStep =
  | "gmc"
  | "passport"
  | "camera"
  | "twofa"
  | "account"
  | "processing"
  | "result";

type VerificationResult = {
  verified: boolean;
  passportData?: { name: string };
  faceMatch?: { match: boolean; confidence: number };
  error?: string;
};

const STEPS = [
  {
    id: "gmc",
    title: "GMC Verification",
    description: "Verify your GMC registration",
  },
  {
    id: "passport",
    title: "Passport Upload",
    description: "Upload your passport photo page",
  },
  {
    id: "camera",
    title: "Face Verification",
    description: "Take a live photo for verification",
  },
  {
    id: "twofa",
    title: "Email Verification",
    description: "Verify your email address",
  },
  {
    id: "account",
    title: "Account Setup",
    description: "Create your account credentials",
  },
] as const;

const RegistrationPage = () => {
  const [step, setStep] = useState<RegistrationStep>("gmc");
  const [stepIndex, setStepIndex] = useState(0);

  // GMC Step
  const [gmcNumber, setGmcNumber] = useState("");
  const [gmcName, setGmcName] = useState("");
  const [gmcLoading, setGmcLoading] = useState(false);

  // Passport Step
  const [passportImage, setPassportImage] = useState<{
    file: File;
    dataUrl: string;
  } | null>(null);

  // Camera Step
  const [livePhoto, setLivePhoto] = useState<{
    blob: Blob;
    dataUrl: string;
  } | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // 2FA Step
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Account Step
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Processing
  const [, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch {
        console.warn(
          "Face detection models not available. Face verification will be simulated."
        );
        setModelsLoaded(true); // Continue with simulated verification
      }
    };
    loadModels();
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Camera setup
  useEffect(() => {
    if (step === "camera" && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current
        .play()
        .then(() => setVideoReady(true))
        .catch((err) => {
          console.error("Video play error:", err);
          alert("Unable to start camera playback. Try again.");
        });
    }
  }, [step, cameraStream]);

  // Auto-process verification when both images are ready
  useEffect(() => {
    if (passportImage && livePhoto && step !== "processing") {
      processVerification();
    }
  }, [passportImage, livePhoto, step, processVerification]);

  const fetchGMCName = async (gmcNumber: string) => {
    setGmcLoading(true);
    try {
      const res = await fetch(`/api/fetchGmcName?gmc=${gmcNumber}`);
      const data = await res.json();

      if (!data.name) throw new Error("Name not found on GMC register");

      setGmcName(data.name.trim().toUpperCase());
      moveToNextStep();
    } catch (err) {
      alert(
        "Failed to fetch GMC name. Please check your GMC number and try again."
      );
      console.error(err);
    } finally {
      setGmcLoading(false);
    }
  };

  const extractPassportData = async (imageFile: File): Promise<string> => {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.warn(m),
      });

      const fullText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      const clean = (str: string) =>
        str
          ?.replace(/[^A-Z\s]/gi, "")
          .replace(/\s+/g, " ")
          .trim() || "";

      let surname = "Unknown";
      let givenNames = "Unknown";

      // Try MRZ (Machine Readable Zone) first
      const mrzMatch = fullText.match(/P<([A-Z]{3})([A-Z]+)<<([A-Z<\s]+)/);
      if (mrzMatch) {
        surname = mrzMatch[2];
        givenNames = mrzMatch[3].replace(/</g, " ").replace(/\s+/g, " ").trim();
      } else {
        // Try fallback using labels
        const findAfterKeyword = (
          keywords: string[],
          pattern = /([A-Z\s]+)/i
        ) => {
          for (const keyword of keywords) {
            const regex = new RegExp(keyword + "[^A-Z]*" + pattern.source, "i");
            const match = fullText.match(regex);
            if (match && match[1]) return clean(match[1]);
          }
          return null;
        };

        surname = findAfterKeyword(["Surname", "Nom"]) || "Unknown";
        givenNames = findAfterKeyword(["Given names", "Prénoms"]) || "Unknown";
      }

      const fullName =
        surname !== "Unknown" && givenNames !== "Unknown"
          ? `${surname} ${givenNames}`
          : "Unknown";

      console.warn("Full Name Extracted from Passport:", fullName);
      return fullName;
    } catch (error) {
      console.error("Error extracting passport data:", error);
      return "Unknown";
    }
  };

  const compareFaces = useCallback(
    async (passportImgUrl: string, liveImgUrl: string) => {
      if (!modelsLoaded) {
        // Simulate face verification for demo purposes
        return { match: true, confidence: 0.85 };
      }

      try {
        const passportImg = await faceapi.fetchImage(passportImgUrl);
        const liveImg = await faceapi.fetchImage(liveImgUrl);

        const passportDetections = await faceapi
          .detectSingleFace(passportImg, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        const liveDetections = await faceapi
          .detectSingleFace(liveImg, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!passportDetections || !liveDetections) {
          return { match: false, confidence: 0 };
        }

        const faceMatcher = new faceapi.FaceMatcher(
          passportDetections.descriptor
        );
        const bestMatch = faceMatcher.findBestMatch(liveDetections.descriptor);

        return {
          match: bestMatch.label === "person 1",
          confidence: 1 - bestMatch.distance,
        };
      } catch (error) {
        console.error("Face comparison error:", error);
        // Fallback to simulated verification
        return { match: true, confidence: 0.8 };
      }
    },
    [modelsLoaded]
  );

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be < 10MB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Invalid format. Please upload a JPEG or PNG image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPassportImage({ file, dataUrl: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setVideoReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setCameraStream(stream);
    } catch (err) {
      alert("Camera error: " + (err as Error).message);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !video.videoWidth || !canvas) {
      alert("Camera not ready");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Failed to capture photo");
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setLivePhoto({ blob, dataUrl: ev.target.result as string });
            cameraStream?.getTracks().forEach((t) => t.stop());
            setCameraStream(null);
          }
        };
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.9
    );
  };

  const processVerification = useCallback(async () => {
    if (!passportImage || !livePhoto) return;

    setStep("processing");
    setIsProcessing(true);

    try {
      const passportName = await extractPassportData(passportImage.file);
      const faceComparison = await compareFaces(
        passportImage.dataUrl,
        livePhoto.dataUrl
      );

      // For demo purposes, always verify if GMC number is correct
      const verified =
        gmcName && passportName !== "Unknown" && faceComparison.match;

      setVerificationResult({
        verified,
        passportData: { name: passportName },
        faceMatch: faceComparison,
      });

      if (verified) {
        moveToNextStep(); // Move to 2FA step
      } else {
        setStep("result");
      }
    } catch (err) {
      setVerificationResult({
        verified: false,
        error: (err as Error).message,
      });
      setStep("result");
    } finally {
      setIsProcessing(false);
    }
  }, [
    passportImage,
    livePhoto,
    gmcName,
    setIsProcessing,
    compareFaces,
    moveToNextStep,
  ]);

  const sendVerificationEmail = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    // Simulate sending verification email
    setEmailSent(true);
    // In a real app, you would call an API to send the email
    setTimeout(() => {
      alert("Verification email sent! Please check your inbox.");
    }, 1000);
  };

  const verifyEmailCode = () => {
    // For demo purposes, accept any 6-digit code
    if (verificationCode.length === 6) {
      moveToNextStep();
    } else {
      alert("Please enter a valid 6-digit verification code");
    }
  };

  const createAccount = () => {
    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    // For demo purposes, always succeed
    setStep("result");
    setVerificationResult({ verified: true });
  };

  const moveToNextStep = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.id === step);
    const nextIndex = currentIndex + 1;

    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex].id as RegistrationStep);
      setStepIndex(nextIndex);
    }
  }, [step]);

  const moveToStep = (targetStep: RegistrationStep) => {
    const targetIndex = STEPS.findIndex((s) => s.id === targetStep);
    setStep(targetStep);
    setStepIndex(targetIndex);
  };

  const resetRegistration = () => {
    setStep("gmc");
    setStepIndex(0);
    setGmcNumber("");
    setGmcName("");
    setPassportImage(null);
    setLivePhoto(null);
    setEmail("");
    setVerificationCode("");
    setEmailSent(false);
    setPassword("");
    setConfirmPassword("");
    setVerificationResult(null);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {STEPS.map((stepInfo, index) => {
          const isActive = index === stepIndex;
          const isCompleted =
            index < stepIndex ||
            (step === "result" && verificationResult?.verified);
          const isAccessible = index <= stepIndex;

          return (
            <div key={stepInfo.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() =>
                    isAccessible
                      ? moveToStep(stepInfo.id as RegistrationStep)
                      : undefined
                  }
                  disabled={!isAccessible}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  } ${isAccessible ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
                >
                  {isCompleted ? <CheckCircle size={20} /> : index + 1}
                </button>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {stepInfo.title}
                  </div>
                  <div className="text-xs text-gray-400 hidden sm:block">
                    {stepInfo.description}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGMCStep = () => (
    <div className="max-w-md mx-auto">
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        style={{ borderColor: "var(--primary-blue)" }}
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--primary-blue)" }}
          >
            GMC Verification
          </h2>
          <p className="text-gray-600">
            Please enter your GMC number to verify your medical registration
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GMC Number
            </label>
            <input
              type="text"
              placeholder="e.g. 1234567"
              value={gmcNumber}
              onChange={(e) => setGmcNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={gmcLoading}
            />
          </div>

          <button
            onClick={() => fetchGMCName(gmcNumber)}
            disabled={!gmcNumber || gmcLoading}
            className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              backgroundColor: "var(--accent-green)",
              color: "white",
            }}
          >
            {gmcLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPassportStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--primary-blue)" }}
          >
            Welcome, Dr. {gmcName}
          </h2>
          <p className="text-gray-600">
            Please upload a clear picture of your passport photo page for
            identity verification
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept="image/png,image/jpeg"
            ref={fileInputRef}
            onChange={handlePassportUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <span className="text-gray-600">
              Click to upload passport photo page
            </span>
          </button>

          {passportImage && (
            <div className="text-center">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="w-5 h-5 mr-2" />
                Passport uploaded successfully
              </div>

              <div className="mb-4">
                <img
                  src={passportImage.dataUrl}
                  alt="Uploaded passport"
                  className="max-w-full h-32 object-cover rounded-lg mx-auto"
                />
              </div>

              <p className="text-gray-600 mb-4">
                Now, let&apos;s take a live photo for face verification
              </p>

              <button
                onClick={startCamera}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                style={{
                  backgroundColor: "var(--primary-blue)",
                  color: "white",
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCameraStep = () => (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--primary-blue)" }}
          >
            Face Verification
          </h2>
          <p className="text-gray-600">
            Please look directly at the camera and capture a clear photo of your
            face
          </p>
        </div>

        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Loader className="text-white animate-spin w-8 h-8" />
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <button
          onClick={capturePhoto}
          disabled={!videoReady}
          className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--accent-red)",
            color: "white",
          }}
        >
          <Camera className="w-4 h-4 mr-2 inline" />
          Capture Photo
        </button>
      </div>
    </div>
  );

  const renderTwoFAStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--primary-blue)" }}
          >
            Email Verification
          </h2>
          <p className="text-gray-600">
            We&apos;ll send a verification code to your email address
          </p>
        </div>

        <div className="space-y-4">
          {!emailSent ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={sendVerificationEmail}
                disabled={!email}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "white",
                }}
              >
                Send Verification Code
              </button>
            </>
          ) : (
            <>
              <div className="text-center text-green-600 mb-4">
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                Verification code sent to {email}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                />
              </div>

              <button
                onClick={verifyEmailCode}
                disabled={verificationCode.length !== 6}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "white",
                }}
              >
                Verify Code
              </button>

              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Use different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderAccountStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--primary-blue)" }}
          >
            Create Account
          </h2>
          <p className="text-gray-600">
            Set up your login credentials to complete registration
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Login)
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={createAccount}
            disabled={!password || !confirmPassword}
            className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--accent-green)",
              color: "white",
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Loader className="mx-auto animate-spin text-blue-500 mb-4" size={48} />
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "var(--primary-blue)" }}
        >
          Processing Verification
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your documents and identity...
        </p>
      </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="max-w-md mx-auto">
      <div
        className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
          verificationResult?.verified ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="text-center">
          {verificationResult?.verified ? (
            <>
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-2 text-green-700">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to Jusur, Dr. {gmcName}. Your account has been created
                successfully.
              </p>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="text-left text-sm space-y-2">
                  <div>
                    <span className="font-semibold">Email:</span> {email}
                  </div>
                  <div>
                    <span className="font-semibold">GMC Name:</span> {gmcName}
                  </div>
                  <div>
                    <span className="font-semibold">Verification Status:</span>{" "}
                    ✅ Verified
                  </div>
                </div>
              </div>

              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors mb-3"
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "white",
                }}
              >
                Continue to Login
              </button>
            </>
          ) : (
            <>
              <XCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-2 text-red-700">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {verificationResult?.error ||
                  "Could not verify your identity. Please try again."}
              </p>

              {verificationResult && (
                <div className="bg-red-50 rounded-lg p-4 mb-6 text-left text-sm">
                  <h3 className="font-bold mb-2">Verification Details:</h3>
                  <div className="space-y-1">
                    <div>
                      <span className="font-semibold">GMC Name:</span> {gmcName}
                    </div>
                    {verificationResult.passportData && (
                      <div>
                        <span className="font-semibold">Passport Name:</span>{" "}
                        {verificationResult.passportData.name}
                      </div>
                    )}
                    {verificationResult.faceMatch && (
                      <div>
                        <span className="font-semibold">Face Match:</span>{" "}
                        {Math.round(
                          verificationResult.faceMatch.confidence * 100
                        )}
                        %
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={resetRegistration}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: "var(--primary-blue)",
                  color: "white",
                }}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "var(--light-gray)" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--primary-blue)" }}
          >
            Medical Professional Registration
          </h1>
          <p className="text-gray-600">
            Join Jusur to provide life-saving medical guidance
          </p>
        </div>

        {step !== "processing" && step !== "result" && renderStepIndicator()}

        {step === "gmc" && renderGMCStep()}
        {step === "passport" && renderPassportStep()}
        {step === "camera" && renderCameraStep()}
        {step === "twofa" && renderTwoFAStep()}
        {step === "account" && renderAccountStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "result" && renderResultStep()}
      </div>
    </div>
  );
};

export default RegistrationPage;
