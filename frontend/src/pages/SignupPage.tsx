import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Scale, Eye, EyeOff, ArrowRight, Shield, UserPlus, ChevronDown } from "lucide-react";
import { useAuth, Language } from "../context/AuthContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "mr", label: "मराठी (Marathi)" },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const a = t.auth;
  const fontFamily = getLangFont(lang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(a.errorFillFields);
      return;
    }
    if (password.length < 6) {
      setError(a.errorPasswordLength);
      return;
    }
    setLoading(true);
    setError("");
    const ok = await signup(name, email, password, language);
    setLoading(false);
    if (ok) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(a.errorGeneric);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-blue-800 flex items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily }}
    >
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30">
              <UserPlus size={24} className="text-white" />
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontWeight: 800 }}>
              {a.signupTitle}
            </h1>
            <p className="text-blue-300 text-sm">{a.signupSubtitle}</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-blue-200 text-sm mb-1.5" style={{ fontWeight: 500 }}>
                {a.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={a.fullNamePlaceholder}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-sm"
              />
            </div>

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
                  placeholder={a.passwordMinPlaceholder}
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

            {/* Language */}
            <div>
              <label className="block text-blue-200 text-sm mb-1.5" style={{ fontWeight: 500 }}>
                {a.preferredLanguage}
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-sm appearance-none cursor-pointer"
                  style={{ colorScheme: "dark" }}
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.code} value={l.code} className="bg-blue-900 text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.common.creatingAccount}
                </>
              ) : (
                <>
                  {t.common.createAccount}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-blue-300 text-sm mt-6">
            {a.hasAccount}{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:text-blue-200 transition-colors"
            >
              {t.common.login}
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-blue-400 text-xs">
          <Shield size={13} />
          <span>{a.dataSecure}</span>
        </div>
      </div>
    </div>
  );
}
