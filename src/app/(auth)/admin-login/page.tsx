"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { isAuthenticated, getUserType } from "@/src/utils/auth";

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false); // 👁️

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const userType = getUserType();
      if (userType === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/user/home-page");
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // 🔹 LOGIN
  const handleSubmit = async () => {
    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep("otp");
      setMessage("OTP has been sent to your registered email 📩");

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "admin");
      router.replace("/dashboard");

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 py-16">
      <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="px-12 py-14">
          <h2 className="text-4xl font-semibold text-white text-center mb-7">
            {step === "login" ? "Staff Login" : "Enter OTP"}
          </h2>

          {message && (
            <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100 mb-6">
              {message}
            </div>
          )}

          {step === "login" ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-lg text-slate-100 mb-3 inline-block">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-4 pr-12 text-xl text-white outline-none transition placeholder:text-slate-400 placeholder:text-base focus:border-grey-100 focus:ring-1 focus:ring-grey-100/1"
                  />
                </div>

                <div>
                  <label className="text-lg text-slate-100 mb-3 inline-block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-4 pr-12 text-xl text-white outline-none transition placeholder:text-slate-400 placeholder:text-base focus:border-grey-100 focus:ring-1 focus:ring-grey-100/1"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <label className="inline-flex items-center gap-2 text-lg text-slate-100">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border border-white/10 bg-[#18181b] text-sky-500 focus:ring-sky-500"
                    />
                    Remember me
                  </label>
                  <button type="button" className="text-lg text-sky-100 hover:text-sky-300">
                    Forgot password?
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-1">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-lg text-slate-100 mb-3 inline-block">Enter OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-4 pr-12 text-lg text-white outline-none transition placeholder:text-slate-400 placeholder:text-base focus:border-grey-100 focus:ring-1 focus:ring-grey-100/1"
                  />
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}