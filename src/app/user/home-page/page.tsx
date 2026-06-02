"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isUser } from "@/src/utils/auth";
import ApplicantHome from "@/screens/users/applicant-home/applicant-home.screen";

export default function UserDashboardPage() {
  const router = useRouter();
  const allowedSections = ["APPLY", "MY-APPS", "FAQ", "CONTACT"] as const;

  const getInitialBodyComponent = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const section = params.get("section");
      if (
        section !== null &&
        (allowedSections as readonly string[]).includes(section)
      ) {
        return section as typeof allowedSections[number];
      }
    }
    return undefined;
  };

  const [defaultBodyComponent] = useState<
    typeof allowedSections[number] | undefined
  >(getInitialBodyComponent);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/user/login");
      return;
    }

    if (!isUser()) {
      router.replace("/dashboard");
      return;
    }
  }, [router]);

  return <ApplicantHome defaultBodyComponent={defaultBodyComponent} />;
}
