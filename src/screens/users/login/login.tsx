"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { fetchUserProfile, loginUser, isAuthenticated, getUserType } from "@/src/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const userType = getUserType();
      if (userType === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/user/home-page");
      }
    } else {
      setIsReady(true);
    }
  }, [router]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginUser(form.email, form.password);
      await fetchUserProfile();

      // Redirect to user home page
      router.push("/user/home-page");

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-2 py-10">
      <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="px-12 py-10">
          <h2 className="text-4xl font-semibold text-white text-center mb-7">
            User Login
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-lg text-slate-100 mb-2 inline-block">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-4 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
              />
            </div>

            <div>
              <label className="text-lg text-slate-100 mb-3 inline-block">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-4 pr-12 text-xl text-white outline-none transition placeholder:text-slate-400 placeholder:text-base focus:border-grey-100 focus:ring-1 focus:ring-grey-100/1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-slate-400">
              <label className="inline-flex items-center gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border border-white/10 bg-[#18181b] text-sky-500 focus:ring-sky-500"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-sky-300 hover:text-sky-200">
                Forgot password?
              </a>
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

            <p className="text-center text-sm text-slate-400">
              Don’t have an account?{' '}
              <Link
                href="/user/register"
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}