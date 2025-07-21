"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface Case {
  id: string;
  title: string;
  description: string;
  specialty: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  symptoms: string[];
  medicalHistory?: string;
  currentMedications: string[];
  testResults: any[];
  images: string[];
  attachments: string[];
  language: string;
  translatedContent?: any;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags?: string[];
}

interface UseCasesOptions {
  page?: number;
  limit?: number;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  specialty?: string;
  autoFetch?: boolean;
}

interface UseCasesResult {
  cases: Case[];
  loading: boolean;
  error: string | null;
  fetchCases: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCases(options: UseCasesOptions = {}): UseCasesResult {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { autoFetch = true, ...queryParams } = options;

  const fetchCases = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('jusur-auth-token');
    if (!token) {
      setError('Not authenticated');
      setCases([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set the auth token in the API client
      apiClient.setAuthToken(token);

      // Make the API call
      const result = await apiClient.cases.getCases(queryParams);
      
      if (result.success && result.data?.cases) {
        setCases(result.data.cases);
      } else {
        setError('Failed to fetch cases');
        setCases([]);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cases');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCases();
    }
  }, [autoFetch]);

  return {
    cases,
    loading,
    error,
    fetchCases,
    refetch: fetchCases,
  };
}

// Hook to check if user is authenticated
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jusur-auth-token');
      const userData = localStorage.getItem('jusur-user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Set token in API client
          apiClient.setAuthToken(token);
        } catch (err) {
          console.error('Error parsing user data:', err);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jusur-auth-token' || e.key === 'jusur-user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('jusur-auth-token');
    localStorage.removeItem('jusur-user');
    apiClient.clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    logout,
  };
}