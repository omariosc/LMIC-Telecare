"use client";

import React from "react";
import {
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "@/hooks/useLanguage";
import type { Case } from "@/hooks/useCases";

interface RealCaseCardProps {
  case_: Case;
  compact?: boolean;
  onClick?: () => void;
}

export const RealCaseCard: React.FC<RealCaseCardProps> = ({ 
  case_, 
  compact = false, 
  onClick 
}) => {
  const { language } = useLanguage();

  const urgencyColors = {
    low: "text-green-600 bg-green-100 dark:bg-green-950",
    medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950",
    high: "text-orange-600 bg-orange-100 dark:bg-orange-950",
    critical: "text-red-600 bg-red-100 dark:bg-red-950",
  };

  const statusColors = {
    open: "text-green-600 bg-green-100 dark:bg-green-950",
    in_progress: "text-purple-600 bg-purple-100 dark:bg-purple-950",
    resolved: "text-green-600 bg-green-100 dark:bg-green-950",
    closed: "text-gray-600 bg-gray-100 dark:bg-gray-950",
  };

  const getUrgencyLabel = (urgency: string) => {
    if (language === "ar") {
      switch (urgency) {
        case "critical": return "حرجة";
        case "high": return "عالية";
        case "medium": return "متوسطة";
        case "low": return "منخفضة";
        default: return urgency;
      }
    }
    return urgency;
  };

  const getStatusLabel = (status: string) => {
    if (language === "ar") {
      switch (status) {
        case "open": return "مفتوحة";
        case "in_progress": return "قيد المعالجة";
        case "resolved": return "محلولة";
        case "closed": return "مغلقة";
        default: return status;
      }
    }
    return status.replace("_", " ");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getCreatorDisplayName = () => {
    if (case_.createdBy) {
      return `${case_.createdBy.firstName} ${case_.createdBy.lastName}`;
    }
    return language === "ar" ? "غير معروف" : "Unknown";
  };

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
              {getUrgencyLabel(case_.urgency)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[case_.status]
              }`}
            >
              {getStatusLabel(case_.status)}
            </span>
            {case_.images && case_.images.length > 0 && (
              <PhotoIcon className="h-3.5 w-3.5 text-gray-400" />
            )}
            {case_.language !== "en" && (
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
          <span>{getCreatorDisplayName()}</span>
          <span>•</span>
          <span>{case_.specialty}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{formatDate(case_.createdAt)}</span>
          {/* Note: The API doesn't seem to return responseCount directly,
              but we could potentially calculate this from the responses */}
        </div>
      </div>

      {/* Patient Info (if available and not compact) */}
      {!compact && (case_.patientAge || case_.patientGender) && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {case_.patientAge && (
            <span>
              {language === "ar" ? "العمر: " : "Age: "}{case_.patientAge}
            </span>
          )}
          {case_.patientAge && case_.patientGender && <span> • </span>}
          {case_.patientGender && (
            <span>
              {language === "ar" ? "الجنس: " : "Gender: "}
              {language === "ar" 
                ? (case_.patientGender === "male" ? "ذكر" : 
                   case_.patientGender === "female" ? "أنثى" : "آخر")
                : case_.patientGender
              }
            </span>
          )}
        </div>
      )}

      {/* Symptoms (if not compact) */}
      {!compact && case_.symptoms && case_.symptoms.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {language === "ar" ? "الأعراض: " : "Symptoms: "}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {case_.symptoms.slice(0, 3).join(", ")}
            {case_.symptoms.length > 3 && "..."}
          </span>
        </div>
      )}

      {/* Assigned specialist (if available) */}
      {case_.assignedTo && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">
            {language === "ar" ? "مكلف إلى: " : "Assigned to: "}
          </span>
          <span>
            {case_.assignedTo.firstName} {case_.assignedTo.lastName}
          </span>
        </div>
      )}
    </div>
  );
};

export default RealCaseCard;