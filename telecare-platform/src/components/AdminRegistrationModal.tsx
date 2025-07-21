"use client";

import React, { useState } from "react";
import {
  UsersIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type ReviewedRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "uk_specialist" | "gaza_clinician";
  gmcNumber?: string;
  specialties?: string[];
  institution?: string;
  yearsOfExperience?: number;
  referralCode?: string;
  createdAt?: string;
  decision: "approved" | "rejected";
  reviewedAt: string;
  reviewedBy: string;
  reviewNotes?: string;
};

type PendingRequest = Partial<ReviewedRequest> & {
  id: string;
  status?: string;
};

type AdminRegistrationModalProps = {
  pendingRequests: PendingRequest[];
  reviewedRequests: ReviewedRequest[];
  setPendingRequests: (requests: PendingRequest[]) => void;
  setReviewedRequests: (requests: ReviewedRequest[]) => void;
  language: "en" | "ar";
  viewMode: "mobile" | "desktop";
};

export default function AdminRegistrationModal({
  pendingRequests,
  reviewedRequests,
  setPendingRequests,
  setReviewedRequests,
  language,
  viewMode,
}: AdminRegistrationModalProps) {
  const [reviewedSectionExpanded, setReviewedSectionExpanded] = useState(false);

  const handleApproveRequest = (requestId: string) => {
    const request = pendingRequests.find((r: any) => r.id === requestId);
    if (!request) return;

    const reviewedRequest: ReviewedRequest = {
      ...request,
      firstName: request.firstName || "",
      lastName: request.lastName || "",
      email: request.email || "",
      role: request.role || "uk_specialist",
      decision: "approved" as const,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "admin_001",
      reviewNotes: "Approved by admin",
    };

    const newPending = pendingRequests.filter((r: any) => r.id !== requestId);
    const newReviewed = [...reviewedRequests, reviewedRequest];

    setPendingRequests(newPending);
    setReviewedRequests(newReviewed);

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingRegistrations", JSON.stringify(newPending));
      localStorage.setItem(
        "reviewedRegistrations",
        JSON.stringify(newReviewed)
      );
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const request = pendingRequests.find((r: any) => r.id === requestId);
    if (!request) return;

    const reviewedRequest: ReviewedRequest = {
      ...request,
      firstName: request.firstName || "",
      lastName: request.lastName || "",
      email: request.email || "",
      role: request.role || "uk_specialist",
      decision: "rejected" as const,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "admin_001",
      reviewNotes: "Rejected by admin",
    };

    const newPending = pendingRequests.filter((r: any) => r.id !== requestId);
    const newReviewed = [...reviewedRequests, reviewedRequest];

    setPendingRequests(newPending);
    setReviewedRequests(newReviewed);

    if (typeof window !== "undefined") {
      localStorage.setItem("pendingRegistrations", JSON.stringify(newPending));
      localStorage.setItem(
        "reviewedRegistrations",
        JSON.stringify(newReviewed)
      );
    }
  };

  const handleReReviewRequest = (requestId: string) => {
    const request = reviewedRequests.find((r: any) => r.id === requestId);
    if (!request) return;

    // Remove decision-related properties to move back to pending
    const { decision, reviewedAt, reviewedBy, reviewNotes, ...pendingRequest } =
      request;
    const restoredRequest = {
      ...pendingRequest,
      status: "pending",
    };

    const newReviewed = reviewedRequests.filter((r: any) => r.id !== requestId);
    const newPending = [...pendingRequests, restoredRequest];

    setReviewedRequests(newReviewed);
    setPendingRequests(newPending);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "reviewedRegistrations",
        JSON.stringify(newReviewed)
      );
      localStorage.setItem("pendingRegistrations", JSON.stringify(newPending));
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Pending Requests Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {language === "ar"
            ? "طلبات التسجيل المعلقة"
            : "Pending Registration Requests"}
        </h2>

        {/* Desktop Card Layout / Mobile List Layout */}
        <div
          className={`${
            viewMode === "desktop"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {pendingRequests.map((request: any) => (
            <div
              key={request.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 overflow-hidden flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100 dark:border-zinc-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold dark:text-white text-lg">
                    {request.firstName} {request.lastName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.role === "uk_specialist"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                    }`}
                  >
                    {request.role === "uk_specialist"
                      ? language === "ar"
                        ? "أخصائي بريطاني"
                        : "UK Specialist"
                      : language === "ar"
                        ? "طبيب غزة"
                        : "Gaza Clinician"}
                  </span>
                </div>

                {/* Email prominently displayed */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-2 mb-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    📧 {request.email}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "رقم GMC:" : "GMC Number:"}
                    </span>
                    <span className="dark:text-white font-mono">
                      {request.gmcNumber || "N/A"}
                    </span>
                  </div>

                  {request.role !== "gaza_clinician" && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {language === "ar" ? "التخصصات:" : "Specialties:"}
                      </span>
                      <span className="dark:text-white text-right max-w-32">
                        {request.specialties?.join(", ") || "N/A"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "المؤسسة:" : "Institution:"}
                    </span>
                    <span className="dark:text-white text-right max-w-32">
                      {request.institution || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "الخبرة:" : "Experience:"}
                    </span>
                    <span className="dark:text-white">
                      {request.yearsOfExperience}{" "}
                      {language === "ar" ? "سنوات" : "years"}
                    </span>
                  </div>

                  {request.role === "gaza_clinician" && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        {language === "ar" ? "رمز الإحالة:" : "Referral Code:"}
                      </span>
                      <span className="dark:text-white font-mono">
                        {request.referralCode || "N/A"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {language === "ar" ? "تاريخ التقديم:" : "Applied:"}
                    </span>
                    <span className="dark:text-white">
                      {new Date(request.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApproveRequest(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium cursor-pointer"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>{language === "ar" ? "موافقة" : "Approve"}</span>
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium cursor-pointer"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>{language === "ar" ? "رفض" : "Reject"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pendingRequests.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {language === "ar"
                ? "لا توجد طلبات تسجيل معلقة"
                : "No Pending Registration Requests"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === "ar"
                ? "سيتم عرض طلبات التسجيل الجديدة هنا"
                : "New registration requests will appear here"}
            </p>
          </div>
        )}
      </div>

      {/* Reviewed Requests Section (Collapsible) */}
      {reviewedRequests.length > 0 && (
        <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
          <button
            onClick={() => setReviewedSectionExpanded(!reviewedSectionExpanded)}
            className="flex items-center justify-between w-full mb-4 p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-150 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <h2 className="text-lg font-semibold dark:text-white">
              {language === "ar" ? "الطلبات المراجعة" : "Reviewed Requests"} (
              {reviewedRequests.length})
            </h2>
            <div
              className={`transform transition-transform ${reviewedSectionExpanded ? "rotate-180" : ""}`}
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {reviewedSectionExpanded && (
            <div
              className={`${
                viewMode === "desktop"
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }`}
            >
              {reviewedRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-200 dark:border-zinc-700 opacity-75 hover:opacity-100 transition-opacity"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold dark:text-white text-lg">
                        {request.firstName} {request.lastName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.decision === "approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {request.decision === "approved"
                          ? language === "ar"
                            ? "مقبول"
                            : "Approved"
                          : language === "ar"
                            ? "مرفوض"
                            : "Rejected"}
                      </span>
                    </div>

                    {/* Email prominently displayed */}
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-2 mb-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        📧 {request.email}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {language === "ar" ? "تاريخ المراجعة:" : "Reviewed:"}
                        </span>
                        <span className="dark:text-white">
                          {new Date(request.reviewedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-800 border-t border-gray-100 dark:border-zinc-700">
                    <button
                      onClick={() => handleReReviewRequest(request.id)}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>
                        {language === "ar" ? "إعادة مراجعة" : "Re-review"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
