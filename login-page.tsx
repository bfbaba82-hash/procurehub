"use client";
import { useState } from "react";
import { Box, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", full_name: "", department: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    if (tab === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data.session) {
        window.location.replace("/dashboard");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data.user) {
        const supabase2 = createClient();
        await supabase2.from("profiles").insert({
          id: data.user.id,
          full_name: form.full_name,
          department: form.department,
          role: "viewer",
        });
        setError("Account created! Please sign in now.");
        setTab("login");
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Box size={22} className="text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">ProcureHub</span>
          </div>
          <p className="text-sm text-gray-500">Procurement management portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-7">
          <div className="flex mb-6 border-b border-gray-100">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <div>
                  <label className="label">Full name *</label>
                  <input className="input" required placeholder="Your full name"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Department</label>
                  <select className="input" value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    <option value="">Select department</option>
                    <option>IT</option><option>Operations</option><option>Admin</option>
                    <option>Logistics</option><option>HR</option><option>Finance</option>
                    <option>Procurement</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="label">Email address *</label>
              <input className="input" type="email" required placeholder="you@company.sa"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input className="input pr-10" type={showPassword ? "text" : "password"}
                  required minLength={8} placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className={`text-xs px-3 py-2 rounded-lg ${
                error.includes("created") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}>{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5 mt-1">
              {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          ProcureHub · Powered by Supabase & Next.js · Free to deploy
        </p>
      </div>
    </div>
  );
}
