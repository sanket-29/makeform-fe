"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { fetchUserProfile, registerUser, isAuthenticated } from "@/src/utils/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/user/home-page");
    } else {
      setIsReady(true);
    }
  }, [router]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await registerUser(form.name, form.email, form.password);
      await fetchUserProfile();

      setMessage("Registration successful!");

      // Redirect to user dashboard after successful registration
      setTimeout(() => {
        router.push("/user/home-page");
      }, 2000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-2 py-3">
      <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="px-10 py-4">
          <h2 className="text-3xl font-semibold text-white text-center mb-4">
            Create your account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-lg text-slate-100 mb-1 inline-block">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-3 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
              />
            </div>

            <div>
              <label className="text-lg text-slate-100 mb-1 inline-block">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-3 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
              />
            </div>

            <div>
              <label className="text-lg text-slate-100 mb-1 inline-block">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-3 pr-12 text-xl text-white outline-none transition placeholder:text-slate-400 placeholder:text-base focus:border-grey-100 focus:ring-1 focus:ring-grey-100/1"
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

            <div>
              <label className="text-lg text-slate-100 mb-1 inline-block">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#242427] px-5 py-3 pr-12 text-xl text-white outline-none transition placeholder:text-slate-400 placeholder:text-base focus:border-grey-100 focus:ring-1 focus:ring-grey-100/1"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-1">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </span>
                  ) : (
                    "Sign Up"
                  )}
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/user/login"
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}