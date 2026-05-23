import { useState } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Mail,
  Globe,
  LogOut,
  Edit2,
  Save,
  X,
  Shield,
  Bell,
  ChevronRight,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useAuth, Language } from "../context/AuthContext";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

const LANGUAGE_OPTIONS: { code: Language; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
];

export default function ProfilePage() {
  const { user, logout, setLanguage } = useAuth();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const p = t.profile;
  const fontFamily = getLangFont(lang);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [selectedLang, setSelectedLang] = useState<Language>(lang);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLanguage(selectedLang);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const SETTINGS_ITEMS = [
    {
      icon: Bell,
      label: p.notifications,
      desc: p.notificationsDesc,
      toggle: true,
    },
    {
      icon: Shield,
      label: p.privacySecurity,
      desc: p.privacySecurityDesc,
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 text-2xl md:text-3xl mb-1" style={{ fontWeight: 800 }}>
          {p.title}
        </h1>
        <p className="text-slate-500 text-sm">{p.subtitle}</p>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 md:p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-blue-500/10 rounded-full" />

        <div className="relative flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center text-3xl font-bold shadow-xl">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
            <p className="text-blue-300 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-full border border-green-500/30 font-medium">
                {t.common.verifiedAccount}
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-500/30">
                {t.common.freePlan}
              </span>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="ml-auto p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-900 font-bold">{p.accountDetails}</h3>
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={14} />
                {t.common.cancel}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={14} />
                {t.common.save}
              </button>
            </div>
          ) : null}
        </div>

        {saved && (
          <div className="mx-5 mt-4 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl border border-green-200 text-sm">
            <CheckCircle size={16} />
            {p.saveChanges}
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
              {p.fullName}
            </label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-slate-50"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl">
                <User size={16} className="text-slate-400" />
                <span className="text-slate-800 text-sm">{user?.name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
              {p.emailAddress}
            </label>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl">
              <Mail size={16} className="text-slate-400" />
              <span className="text-slate-800 text-sm">{email}</span>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {t.common.verified}
              </span>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
              {p.preferredLanguage}
            </label>
            {editing ? (
              <div className="grid grid-cols-3 gap-3">
                {LANGUAGE_OPTIONS.map((langOpt) => (
                  <button
                    key={langOpt.code}
                    onClick={() => setSelectedLang(langOpt.code)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedLang === langOpt.code
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-blue-300 text-slate-600"
                    }`}
                  >
                    <span className="text-2xl">{langOpt.flag}</span>
                    <span className="text-sm font-medium">{langOpt.native}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl">
                <Globe size={16} className="text-slate-400" />
                <span className="text-slate-800 text-sm">
                  {LANGUAGE_OPTIONS.find((l) => l.code === lang)?.native || "English"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-slate-900 font-bold">{p.settings}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {SETTINGS_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <item.icon size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm font-medium">{item.label}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-slate-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm">
        <div className="px-5 py-4 border-b border-red-100">
          <h3 className="text-red-600 font-bold">{p.accountActions}</h3>
        </div>
        <div className="p-5 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 group border border-red-100 hover:border-red-200"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-semibold text-sm">{t.common.logout}</p>
              <p className="text-red-400 text-xs">{p.logoutDesc}</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-red-300" />
          </button>

          <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-all duration-200 group border border-slate-100">
            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-semibold text-sm">{p.deleteAccount}</p>
              <p className="text-slate-400 text-xs">{p.deleteAccountDesc}</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-slate-300" />
          </button>
        </div>
      </div>

      {/* App info */}
      <div className="text-center mt-8 text-slate-400 text-xs">
        <p>{p.appInfo}</p>
        <p className="mt-1">
          <a href="#" className="hover:text-blue-500 transition-colors">
            {p.privacyPolicy}
          </a>
          {" · "}
          <a href="#" className="hover:text-blue-500 transition-colors">
            {p.termsOfUse}
          </a>
          {" · "}
          <a href="#" className="hover:text-blue-500 transition-colors">
            {p.contactSupport}
          </a>
        </p>
      </div>
    </div>
  );
}
