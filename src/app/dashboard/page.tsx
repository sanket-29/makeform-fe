"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "@/src/utils/auth";
import DashboardLayout from "@/src/components/dashboard-layout";
import MidLayout from "@/src/components/mid-layout";
import RightPanel from "@/src/components/right-panel";
import { Provider } from "react-redux";
import { store } from "@/src/redux/store/store";

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin-login");
      return;
    }

    if (!isAdmin()) {
      router.replace("/user/home-page");
      return;
    }

    fetch("http://localhost:5000/api/form/getForms", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setForms(data));
  }, [router]);

  return (
    <Provider store={store}>
      <DashboardLayout>
        <div className="flex gap-6 h-full min-h-0">
          <MidLayout forms={forms} activeId={activeId} setActiveId={setActiveId} />
          <RightPanel activeId={activeId} forms={forms} />
        </div>
      </DashboardLayout>
    </Provider>
  );
}
