"use client";

import { useEffect, useState, type ReactNode } from "react";
import { fetchUserProfile, isAuthenticated, isUser } from "@/src/utils/auth";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [profileLoaded, setProfileLoaded] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !isUser()) {
      return;
    }

    const refreshProfile = async () => {
      setProfileLoaded(false);
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      } finally {
        setProfileLoaded(true);
      }
    };

    refreshProfile();
  }, []);

  if (!profileLoaded) {
    return null;
  }

  return <>{children}</>;
}
