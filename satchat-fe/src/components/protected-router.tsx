// Stub protected route component
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const checkAuth = () => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [isAuthenticated, isLoading, router]);

  return <>{children}</>;
};
