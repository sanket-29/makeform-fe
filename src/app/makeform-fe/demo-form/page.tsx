"use client";

// import DashboardLayout from "@/src/components/dashboard-layout";

export default function FormPage() {
  return (
    // <DashboardLayout>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-500 text-center mb-4">Demo Form</h2>
          <iframe
            src="https://in.makeforms.co/uizrdmu/"
            style={{
              width: "100%",
              height: "500px",
              maxHeight: "100%",
              maxWidth: "100%",
            }}
          />
        </div>
      </div>
    // </DashboardLayout>
  );
}
