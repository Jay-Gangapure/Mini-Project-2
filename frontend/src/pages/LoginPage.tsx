import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Scale, Eye, EyeOff, ArrowRight, Shield, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

export default function LoginPage() {
  const { login } = useAuth();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const a = t.auth;
  const fontFamily = getLangFont(lang);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    setError(a.errorFillFields);
    return;
  }

  setLoading(true);
  setError("");

  const ok = await login(email, password);

  setLoading(false);

  if (ok) {
    navigate("/dashboard", { replace: true });
  } else {
    setError(a.errorInvalidCredentials);
  }
};
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily }}
    >
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo & lang */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
              <Scale size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">{t.common.appName}</span>
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl shadow-blue-950/50">
          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-500/30">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontWeight: 800 }}>
              {a.loginTitle}
            </h1>
            <p className="text-blue-300 text-sm">{a.loginSubtitle}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-blue-200 text-sm mb-1.5" style={{ fontWeight: 500 }}>
                {a.emailAddress}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={a.emailPlaceholder}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-blue-200 text-sm mb-1.5" style={{ fontWeight: 500 }}>
                {a.password}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={a.passwordPlaceholder}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setRemember(!remember)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    remember
                      ? "bg-blue-500 border-blue-500"
                      : "border-white/30 hover:border-blue-400"
                  }`}
                >
                  {remember && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-blue-200 text-sm">{a.rememberMe}</span>
              </label>
              <a href="#" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                {a.forgotPassword}
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.common.loggingIn}
                </>
              ) : (
                <>
                  {t.common.loginToContinue}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-blue-300 text-sm mt-6">
            {a.noAccount}{" "}
            <Link
              to="/signup"
              className="text-white font-semibold hover:text-blue-200 transition-colors"
            >
              {t.common.createAccount}
            </Link>
          </p>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-blue-400 text-xs">
          <Shield size={13} />
          <span>{a.securityNote}</span>
        </div>
      </div>
    </div>
  );
}