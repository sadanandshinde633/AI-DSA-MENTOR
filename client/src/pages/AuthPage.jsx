import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields");
    if (tab === "register" && !form.name) return setError("Name is required");

    try {
      setLoading(true);
      const url = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = tab === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(`${API}${url}`, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-xl font-semibold text-white">AI DSA Mentor</h1>
          <p className="text-slate-500 text-sm mt-1">Learn Data Structures & Algorithms</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-6">

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {tab === "register" && (
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handle}
                  onKeyDown={handleKey}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                onKeyDown={handleKey}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                onKeyDown={handleKey}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
          >
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Switch */}
          <p className="text-center text-xs text-slate-600 mt-4">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {tab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
