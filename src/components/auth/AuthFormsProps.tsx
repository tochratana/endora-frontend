"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Github } from "lucide-react";
import {
  loginSchema,
  registerSchema,
  LoginInput,
  RegisterInput,
} from "@/lib/validations/auth";
// import { useRegisterMutation } from "@/store/api/authApi";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
import { useRegisterMutation } from "@/app/store/api/authApi";
import Button from "../button/Button";
import Input from "../button/Input";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import Button from "../ui/Button";

interface AuthFormsProps {
  defaultMode?: "login" | "register";
}

const AuthForms: React.FC<AuthFormsProps> = ({ defaultMode = "login" }) => {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [register] = useRegisterMutation();

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    setError: setLoginError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Register form
  const {
    register: registerSignup,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    setError: setRegisterError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("github", {
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        setLoginError("root", { message: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("root", { message: "An error occurred during login" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // After successful registration, automatically sign in
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        throw new Error("Failed to sign in after registration");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed";

      if (error.message) {
        errorMessage = error.message;
      }

      setRegisterError("root", { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "github" | "keycloak"
  ) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-500 p-8 lg:p-12 text-white flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <div className="w-8 h-8 bg-white/40 rounded flex items-center justify-center">
                    <span className="text-sm font-bold">API</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold">Endora</h1>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Welcome to Endura
              </h2>
              <p className="text-xl text-white/80">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </p>
            </div>

            <div className="space-y-4 text-white/70">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
                <span>Secure authentication with Keycloak</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
                <span>Multiple sign-in options</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Forms */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {isLogin ? "Sign in" : "Create Account"}
              </h3>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => handleSocialLogin("keycloak")}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  <div className="w-5 h-5 mr-3 bg-red-600 rounded"></div>
                  Continue with Keycloak
                </Button>

                <Button
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  onClick={() => handleSocialLogin("github")}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  <Github className="w-5 h-5 mr-3" />
                  Continue with Github
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Login Form */}
              {isLogin ? (
                <div className="space-y-4">
                  <Input
                    label="📧 Email"
                    type="email"
                    placeholder="johndoe@example.com"
                    error={loginErrors.email?.message}
                    {...registerLogin("email")}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...registerLogin("password")}
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  {loginErrors.root && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.root.message}
                    </p>
                  )}

                  <Button
                    onClick={handleLoginSubmit(handleLogin)}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              ) : (
                /* Register Form */
                <div className="space-y-4">
                  <Input
                    label="👤 Full Name"
                    type="text"
                    placeholder="John Doe"
                    error={registerErrors.name?.message}
                    {...registerSignup("name")}
                  />

                  <Input
                    label="📧 Email"
                    type="email"
                    placeholder="johndoe@example.com"
                    error={registerErrors.email?.message}
                    {...registerSignup("email")}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...registerSignup("password")}
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerErrors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔒 Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...registerSignup("confirmPassword")}
                        className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {registerErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {registerErrors.root && (
                    <p className="text-red-500 text-sm">
                      {registerErrors.root.message}
                    </p>
                  )}

                  <Button
                    onClick={handleRegisterSubmit(handleRegister)}
                    isLoading={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              )}

              {/* Toggle Form */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin
                    ? "Don't have account? "
                    : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {isLogin ? "Sign up now" : "Sign in now"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
