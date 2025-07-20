Page.tsx;

("use client");

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Loader,
} from "lucide-react";
import Tesseract from "tesseract.js";

import * as faceapi from "face-api.js";

const IdentityVerificationMVP = () => {
  const [step, setStep] = useState("nhs");
  const [nhsEmail, setNhsEmail] = useState("");
  const [gmcNumber, setGmcNumber] = useState("");
  const [gmcName, setGmcName] = useState("");

  const [passportImage, setPassportImage] = useState(null);
  const [livePhoto, setLivePhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const videoRef = useRef();
  const canvasRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    return () => {
      if (cameraStream)
        cameraStream.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream]);

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

  useEffect(() => {
    if (passportImage && livePhoto) processVerification();
  }, [passportImage, livePhoto]);

  const fetchGMCName = async (gmcNumber) => {
    try {
      const res = await fetch(`/api/fetchGmcName?gmc=${gmcNumber}`);
      const data = await res.json();

      if (!data.name) throw new Error("Name not found on GMC register");

      setGmcName(data.name.trim().toUpperCase());
      setStep("upload");
    } catch (err) {
      alert("Failed to fetch GMC name");
      console.error(err);
    }
  };

  const extractPassportData = async (imageFile) => {
    const {
      data: { text },
    } = await Tesseract.recognize(imageFile, "eng", {
      logger: (m) => console.log(m),
    });

    const fullText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    const clean = (str) =>
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
      const findAfterKeyword = (keywords, pattern = /([A-Z\s]+)/i) => {
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

    console.log("Full Name Extracted from Passport:", fullName);
    return fullName;
  };

  const compareFaces = async (passportImgUrl, liveImgUrl) => {
    if (!modelsLoaded) {
      alert("Face models not loaded yet. Please wait.");
      return { match: false, confidence: 0 };
    }

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

    const faceMatcher = new faceapi.FaceMatcher(passportDetections.descriptor);
    const bestMatch = faceMatcher.findBestMatch(liveDetections.descriptor);

    return {
      match: bestMatch.label === "person 1",
      confidence: 1 - bestMatch.distance,
    };
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert("File size must be < 10MB");
    if (!["image/jpeg", "image/png"].includes(file.type))
      return alert("Invalid format");
    const reader = new FileReader();
    reader.onload = (ev) =>
      setPassportImage({ file, dataUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setVideoReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setStep("camera");
    } catch (err) {
      alert("Camera error: " + err.message);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !video.videoWidth) return alert("Camera not ready");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return alert("Failed to capture photo");
        const reader = new FileReader();
        reader.onload = (ev) => {
          setLivePhoto({ blob, dataUrl: ev.target.result });
          cameraStream.getTracks().forEach((t) => t.stop());
          setCameraStream(null);
        };
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.9
    );
  };

  const processVerification = async () => {
    if (!passportImage || !livePhoto) return;
    setStep("processing");
    setIsProcessing(true);
    try {
      const passportName = await extractPassportData(passportImage.file);
      const faceComparison = await compareFaces(
        passportImage.dataUrl,
        livePhoto.dataUrl
      );
      const verified =
        faceComparison.match &&
        gmcName &&
        passportName.includes(gmcName.toUpperCase());
      setVerificationResult({
        verified,
        passportData: { name: passportName },
        faceMatch: faceComparison,
      });
      setStep("result");
    } catch (err) {
      setVerificationResult({ verified: false, error: err.message });
      setStep("result");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderNHSInput = () => (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Enter NHS Email</h2>
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="e.g. john.doe@nhs.net"
        value={nhsEmail}
        onChange={(e) => setNhsEmail(e.target.value)}
      />
      <button
        disabled={!nhsEmail}
        onClick={() => setStep("gmc")}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Continue
      </button>
    </div>
  );

  const renderGMCInput = () => (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-2">
        Hello Dr, please enter your GMC number
      </h2>
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="e.g. 1234567"
        value={gmcNumber}
        onChange={(e) => setGmcNumber(e.target.value)}
      />
      <button
        disabled={!gmcNumber}
        onClick={() => fetchGMCName(gmcNumber)}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Continue
      </button>
    </div>
  );

  const renderUploadStep = () => (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-2">Welcome, {gmcName}</h2>
      <p className="mb-4">
        Please upload a clear picture of your passport photo page.
      </p>
      <div className="mb-4">
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handlePassportUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <Upload className="mr-2" /> Upload Passport
        </button>
        {passportImage && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="mr-2" /> Passport Uploaded
          </div>
        )}
      </div>
      {passportImage && (
        <div>
          <p className="mb-4">
            Now, let's take a live photo for face verification.
          </p>
          <button
            onClick={startCamera}
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 flex items-center justify-center"
          >
            <Camera className="mr-2" /> Start Camera
          </button>
        </div>
      )}
    </div>
  );

  const renderCameraStep = () => (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-bold mb-2">Live Photo Capture</h2>
      <div className="relative w-full aspect-video bg-black rounded overflow-hidden mb-4">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        {!videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader className="text-white animate-spin" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={capturePhoto}
        disabled={!videoReady}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
      >
        Capture Photo
      </button>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="max-w-md mx-auto text-center">
      <Loader className="mx-auto animate-spin text-blue-500" size={48} />
      <p className="mt-4 text-lg">Processing verification, please wait...</p>
    </div>
  );

  const renderResultStep = () => (
    <div
      className={`max-w-md mx-auto bg-white p-6 rounded shadow text-center ${
        verificationResult?.verified ? "border-green-500" : "border-red-500"
      } border-2`}
    >
      {verificationResult?.verified ? (
        <>
          <CheckCircle className="mx-auto text-green-500" size={48} />
          <h2 className="text-2xl font-bold mt-4 text-green-700">
            Verification Successful
          </h2>
          <p className="mt-2">Welcome, Dr. {gmcName}.</p>
        </>
      ) : (
        <>
          <XCircle className="mx-auto text-red-500" size={48} />
          <h2 className="text-2xl font-bold mt-4 text-red-700">
            Verification Failed
          </h2>
          <p className="mt-2">
            {verificationResult?.error || "Could not verify your identity."}
          </p>
        </>
      )}
      <div className="text-left mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Verification Details:</h3>
        <p>
          <span className="font-semibold">GMC Name:</span> {gmcName}
        </p>
        {verificationResult?.passportData && (
          <>
            <p>
              <span className="font-semibold">Passport Name:</span>{" "}
              {verificationResult.passportData.name}
            </p>
            <p>
              <span className="font-semibold">Passport Number:</span>{" "}
              {verificationResult.passportData.passportNumber}
            </p>
          </>
        )}
        {verificationResult?.faceMatch && (
          <p>
            <span className="font-semibold">Face Match Confidence:</span>{" "}
            {Math.round(verificationResult.faceMatch.confidence * 100)}%
          </p>
        )}
      </div>
      <button
        onClick={() => {
          setStep("nhs");
          setGmcNumber("");
          setGmcName("");
          setPassportImage(null);
          setLivePhoto(null);
          setVerificationResult(null);
        }}
        className="w-full mt-6 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
      >
        Start Over
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Identity Verification MVP</h1>
        </div>
        {step === "nhs" && renderNHSInput()}
        {step === "gmc" && renderGMCInput()}
        {step === "upload" && renderUploadStep()}
        {step === "camera" && renderCameraStep()}
        {step === "processing" && renderProcessingStep()}
        {step === "result" && renderResultStep()}
      </div>
    </div>
  );
};

export default IdentityVerificationMVP;
