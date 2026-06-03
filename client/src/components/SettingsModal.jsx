import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

function SettingsModal({ user, onClose, onUpdate, onLogout }) {
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const saveProfile = async () => {
    setError("");
    setSuccess("");

    if (tab === "password") {
      if (!form.password) return setError("Enter a new password");
      if (form.password.length < 6) return setError("Password must be at least 6 characters");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = tab === "profile"
        ? { name: form.name, email: form.email }
        : { password: form.password };

      const res = await axios.put(`${API}/api/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onUpdate(res.data.user);
      setSuccess(tab === "profile" ? "Profile updated!" : "Password changed!");
      if (tab === "password") setForm({ ...form, password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0f1117] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User card */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-base font-bold text-white shrink-0">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || "No email"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {[
            { key: "profile", label: "Personal Info" },
            { key: "password", label: "Password" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setError(""); setSuccess(""); }}
              className={`flex-1 py-3 text-xs font-medium transition-all ${
                tab === t.key
                  ? "text-white border-b border-blue-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-3">
          {tab === "profile" ? (
            <>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handle}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">New Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handle}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </>
          )}

          {error && (
            <div className="px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
              ✓ {success}
            </div>
          )}

          <button
            onClick={saveProfile}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Logout */}
        <div className="px-6 pb-5">
          <div className="h-px bg-white/5 mb-4" />
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-all"
            >
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 text-center">Are you sure you want to sign out?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-medium rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SettingsModal;
