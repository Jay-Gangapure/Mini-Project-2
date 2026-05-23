import { Link } from "react-router";
import {
  Scale,
  Mic,
  MapPin,
  FileText,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Phone,
  ChevronRight,
  Star,
  Globe,
  Users,
} from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

export default function LandingPage() {
  const { t, lang } = useTranslation();
  const l = t.landing;
  const fontFamily = getLangFont(lang);

  const FEATURES = [
    {
      icon: Zap,
      title: l.features.situationTitle,
      desc: l.features.situationDesc,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      icon: Mic,
      title: l.features.voiceTitle,
      desc: l.features.voiceDesc,
      color: "from-violet-500 to-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      icon: MapPin,
      title: l.features.directoryTitle,
      desc: l.features.directoryDesc,
      color: "from-emerald-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      icon: FileText,
      title: l.features.documentTitle,
      desc: l.features.documentDesc,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  const STEPS = [
    {
      num: "01",
      title: l.howItWorks.step1Title,
      desc: l.howItWorks.step1Desc,
      icon: Shield,
    },
    {
      num: "02",
      title: l.howItWorks.step2Title,
      desc: l.howItWorks.step2Desc,
      icon: Zap,
    },
    {
      num: "03",
      title: l.howItWorks.step3Title,
      desc: l.howItWorks.step3Desc,
      icon: CheckCircle,
    },
  ];

  const STATS = [
    { value: "50+", label: l.stats.situations },
    { value: "3", label: l.stats.languages },
    { value: "100%", label: l.stats.free },
    { value: "24/7", label: l.stats.available },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Scale size={18} className="text-white" />
            </div>
            <span className="text-blue-900 font-bold text-xl tracking-tight">
              {t.common.appName}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">

            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              {l.navHowItWorks}
            </a>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              {l.navFeatures}
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors">
              {l.navAbout}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/login"
              className="text-sm text-blue-700 font-medium hover:text-blue-800 transition-colors hidden sm:block"
            >
              {t.common.login}
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg"
            >
              {t.common.getStarted}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-800/60 backdrop-blur text-blue-300 text-sm px-4 py-2 rounded-full border border-blue-700/50 mb-8">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>{l.badge}</span>
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
              style={{ fontFamily: lang === "en" ? "'Plus Jakarta Sans', sans-serif" : fontFamily, fontWeight: 800 }}
            >
              {l.heroTitle1}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {l.heroTitle2}
              </span>
            </h1>

            <p className="text-blue-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              {l.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-semibold text-base hover:bg-blue-50 transition-all duration-200 shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
              >
                {t.common.getStartedFree}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-blue-800/50 backdrop-blur text-white border border-blue-700/50 px-8 py-4 rounded-2xl font-semibold text-base hover:bg-blue-700/50 transition-all duration-200 w-full sm:w-auto justify-center"
              >
                {t.common.tryDemo}
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 text-blue-300 text-sm">
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-green-400" />
                {l.securityBadge}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-blue-400" />
                {l.languagesBadge}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-purple-400" />
                {l.freeBadge}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-amber-400" />
                {l.availableBadge}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm px-4 py-1.5 rounded-full mb-4 font-medium">
              {l.howItWorks.heading}
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 mb-4" style={{ fontWeight: 800 }}>
              {l.howItWorks.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 to-blue-300" />
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center group">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                    <step.icon size={26} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold shadow-sm">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-slate-900 text-lg mb-3" style={{ fontWeight: 700 }}>
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm px-4 py-1.5 rounded-full mb-4 font-medium">
              {l.features.heading}
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 mb-4" style={{ fontWeight: 800 }}>
              {l.features.title}
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{l.features.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl p-6 border ${f.bg} ${f.border} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group cursor-pointer`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-slate-900 mb-2 text-base" style={{ fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-3xl md:text-4xl text-blue-700 mb-1"
                  style={{ fontWeight: 800 }}
                >
                  {s.value}
                </div>
                <div className="text-slate-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-6" style={{ fontWeight: 800 }}>
            {l.cta.title}
          </h2>
          <p className="text-blue-200 text-lg mb-10">{l.cta.desc}</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-900 px-10 py-4 rounded-2xl font-bold text-base hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {t.common.startForFree}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-slate-900 text-slate-400 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Scale size={18} className="text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">{t.common.appName}</span>
                <p className="text-slate-500 text-xs">{l.footer.aiAssistant}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                {l.footer.privacyPolicy}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {l.footer.termsOfUse}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {l.footer.contact}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {l.footer.about}
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8">
            <p className="text-sm text-slate-500 leading-relaxed max-w-4xl">
              <strong className="text-slate-400">⚠️ {t.common.disclaimer}:</strong>{" "}
              {l.footer.disclaimer}
            </p>
            <p className="text-xs text-slate-600 mt-4">{l.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
