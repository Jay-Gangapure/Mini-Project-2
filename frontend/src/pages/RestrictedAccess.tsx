import { Link, useLocation } from "react-router";
import { Lock, ArrowRight, Scale, Shield } from "lucide-react";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

export default function RestrictedAccess() {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const attemptedPath = (location.state as any)?.from?.pathname || "";
  const r = t.auth.restricted;
  const fontFamily = getLangFont(lang);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden"
      style={{ fontFamily }}
    >
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative text-center max-w-md">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
            <Scale size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">{t.common.appName}</span>
        </Link>

        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-2xl">
            <Lock size={50} className="text-white" />
          </div>
          {/* Shield badge */}
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
            <Shield size={22} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl text-white mb-3" style={{ fontWeight: 800 }}>
          {r.title}
        </h1>
        <p className="text-blue-300 text-base mb-2">{r.subtitle}</p>
        {attemptedPath && (
          <p className="text-blue-400/70 text-sm mb-8">
            {r.attemptedAccess}{" "}
            <span className="text-blue-300 font-medium">{attemptedPath}</span>
          </p>
        )}
        {!attemptedPath && <div className="mb-8" />}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <Lock size={16} />
            {r.goToLogin}
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-3.5 rounded-2xl font-medium text-sm hover:bg-white/20 transition-all duration-200"
          >
            {r.viewLanding}
          </Link>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-10 text-blue-400 text-xs">
          <Shield size={13} />
          <span>{r.securityNote}</span>
        </div>
      </div>
    </div>
  );
}
