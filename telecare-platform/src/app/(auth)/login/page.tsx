"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, redirect to dashboard
      window.location.href = "/dashboard";
    }, 1500);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert("Please enter your email address");
      return;
    }

    // For demo purposes, always reset password to "Password"
    setResetSent(true);

    // Simulate API call
    setTimeout(() => {
      alert("Your password has been reset to: Password");
    }, 1000);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setResetSent(false);
  };

  if (showForgotPassword) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--light-gray)" }}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--primary-blue)" }}
              >
                Reset Password
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your email address and we&apos;ll reset your password
              </p>
            </div>

            {!resetSent ? (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleForgotPassword}
                    disabled={!forgotEmail}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--accent-green)",
                      color: "white",
                    }}
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={resetForgotPassword}
                    className="w-full py-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Password Reset Sent
                  </h3>
                  <p className="text-gray-600">
                    Your password has been reset. Check the alert message for
                    your new temporary password.
                  </p>
                </div>

                <button
                  onClick={resetForgotPassword}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: "var(--primary-blue)",
                    color: "white",
                  }}
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--light-gray)" }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--primary-blue)" }}
            >
              Welcome Back
            </h2>
            <p className="text-gray-600 mt-2">Sign in to your Jusur account</p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={!email || !password || isLoading}
              className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{
                backgroundColor: "var(--accent-green)",
                color: "white",
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Register as a medical professional
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
