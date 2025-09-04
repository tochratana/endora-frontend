"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "../ui/button";

const AuthForms: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleKeycloak = async () => {
    setIsLoading(true);
    try {
      await signIn("keycloak", { callbackUrl: "/dashboard" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Sign in with Keycloak</h2>
        <p className="mb-6 text-sm text-gray-600">
          Your organization uses Keycloak for authentication. Click below to
          continue.
        </p>

        <Button
          onClick={handleKeycloak}
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? "Redirecting..." : "Continue with Keycloak"}
        </Button>
      </div>
    </div>
  );
};

export default AuthForms;
