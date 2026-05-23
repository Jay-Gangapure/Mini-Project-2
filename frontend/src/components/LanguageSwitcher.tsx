import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useAuth, Language } from "../context/AuthContext";

const LANG_OPTIONS: { code: Language; label: string; short: string; native: string }[] = [
  { code: "en", label: "English", short: "EN", native: "English" },
  { code: "hi", label: "Hindi", short: "HI", native: "हिंदी" },
  { code: "mr", label: "Marathi", short: "MR", native: "मराठी" },
];

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANG_OPTIONS.find((l) => l.code === language)!;

  const isDark = variant === "dark";

  return (
    <div ref={ref} className="relative z-50">
      {/* Segmented pill trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 text-sm font-semibold group ${
          isDark
            ? "bg-white/15 border-white/20 text-white hover:bg-white/25 backdrop-blur"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 shadow-sm"
        }`}
        aria-label="Switch language"
      >
        <Globe
          size={14}
          className={`transition-transform duration-300 ${open ? "rotate-12 scale-110" : ""} ${
            isDark ? "text-white/80" : "text-blue-500"
          }`}
        />
        <span className="tracking-wide">{current.short}</span>
        {/* Indicator dot */}
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
            open
              ? isDark
                ? "bg-white scale-125"
                : "bg-blue-600 scale-125"
              : isDark
              ? "bg-white/50"
              : "bg-blue-300"
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-44 rounded-2xl border overflow-hidden shadow-2xl transition-all duration-200 origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        } ${
          isDark
            ? "bg-blue-900/95 backdrop-blur-xl border-white/15 shadow-blue-950/60"
            : "bg-white/98 backdrop-blur-xl border-blue-100 shadow-blue-100/80"
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 py-2.5 border-b flex items-center gap-2 ${
            isDark ? "border-white/10" : "border-blue-50"
          }`}
        >
          <Globe size={12} className={isDark ? "text-blue-300" : "text-blue-400"} />
          <span
            className={`text-xs font-semibold tracking-wider uppercase ${
              isDark ? "text-blue-300" : "text-blue-400"
            }`}
          >
            Language
          </span>
        </div>

        {/* Options */}
        {LANG_OPTIONS.map((opt, i) => {
          const isActive = language === opt.code;
          return (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-150 group ${
                i < LANG_OPTIONS.length - 1
                  ? isDark
                    ? "border-b border-white/5"
                    : "border-b border-slate-50"
                  : ""
              } ${
                isActive
                  ? isDark
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600 text-white"
                  : isDark
                  ? "text-blue-100 hover:bg-white/10"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Active indicator */}
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "bg-white scale-125 shadow-sm"
                      : isDark
                      ? "bg-white/20"
                      : "bg-slate-200 group-hover:bg-blue-200"
                  }`}
                />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">{opt.native}</p>
                  <p
                    className={`text-xs leading-tight mt-0.5 ${
                      isActive ? "text-blue-200" : isDark ? "text-blue-400" : "text-slate-400"
                    }`}
                  >
                    {opt.label}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isDark
                    ? "text-blue-400"
                    : "text-slate-400 group-hover:text-blue-500"
                }`}
              >
                {opt.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
