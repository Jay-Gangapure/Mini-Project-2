import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Car,
  Wallet,
  Monitor,
  Home,
  ShoppingBag,
  Heart,
  Mic,
  MicOff,
  Search,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useTranslation, getLangFont } from "../i18n/useTranslation";
import useVoice from "../hooks/useVoiceInput";

export default function SituationAssistant() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const s = t.situation;
  const fontFamily = getLangFont(lang);

  const SITUATIONS = [
    {
      id: "traffic-police",
      icon: Car,
      title: s.situations.trafficPolice.title,
      desc: s.situations.trafficPolice.desc,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      tag: s.situations.trafficPolice.tag,
      tagBg: "bg-blue-100 text-blue-600",
    },
    {
      id: "salary-not-paid",
      icon: Wallet,
      title: s.situations.salaryNotPaid.title,
      desc: s.situations.salaryNotPaid.desc,
      color: "from-emerald-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-700",
      tag: s.situations.salaryNotPaid.tag,
      tagBg: "bg-green-100 text-green-600",
    },
    {
      id: "cyber-fraud",
      icon: Monitor,
      title: s.situations.cyberFraud.title,
      desc: s.situations.cyberFraud.desc,
      color: "from-red-500 to-rose-600",
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-red-700",
      tag: s.situations.cyberFraud.tag,
      tagBg: "bg-red-100 text-red-600",
    },
    {
      id: "landlord-issue",
      icon: Home,
      title: s.situations.landlordIssue.title,
      desc: s.situations.landlordIssue.desc,
      color: "from-amber-500 to-yellow-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      tag: s.situations.landlordIssue.tag,
      tagBg: "bg-amber-100 text-amber-600",
    },
    {
      id: "consumer-complaint",
      icon: ShoppingBag,
      title: s.situations.consumerComplaint.title,
      desc: s.situations.consumerComplaint.desc,
      color: "from-purple-500 to-violet-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
      tag: s.situations.consumerComplaint.tag,
      tagBg: "bg-purple-100 text-purple-600",
    },
    {
      id: "domestic-violence",
      icon: Heart,
      title: s.situations.domesticViolence.title,
      desc: s.situations.domesticViolence.desc,
      color: "from-pink-500 to-rose-500",
      bg: "bg-pink-50",
      border: "border-pink-200",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      textColor: "text-pink-700",
      tag: s.situations.domesticViolence.tag,
      tagBg: "bg-red-100 text-red-600",
    },
  ];

  const [search, setSearch] = useState("");
  const {
    listening,
    startListening,
    stopListening,
  } = useVoice(lang);

  const [selected, setSelected] = useState<string | null>(null);

  const filtered = SITUATIONS.filter(
    (sit) =>
      sit.title.toLowerCase().includes(search.toLowerCase()) ||
      sit.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => {
      navigate(`/guidance/${id}`);
    }, 300);
  };
  const handleVoiceAssistant = () => {

    if (listening) {
      stopListening();
      return;
    }

    startListening(
      (finalTranscript: string) => {

        if (!finalTranscript.trim()) return;

        // STORE QUERY
        localStorage.setItem(
          "nyaysathi_voice_query",
          finalTranscript
        );

        // NAVIGATE TO CHAT PAGE
        navigate("/chat", {
          state: {
            voiceQuery: finalTranscript,
            fromVoiceAssistant: true,
          },
        });
      }
    );
  };
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 text-sm px-4 py-1.5 rounded-full mb-4 font-medium">
          <Flame size={14} />
          {s.badge}
        </div>
        <h1 className="text-slate-900 text-3xl md:text-4xl mb-4" style={{ fontWeight: 800 }}>
          {s.title}
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto">{s.subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={s.searchPlaceholder}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 shadow-sm text-sm"
        />
      </div>

      {/* Situation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filtered.map((situation) => (
          <button
            key={situation.id}
            onClick={() => handleSelect(situation.id)}
            className={`group relative text-left rounded-2xl p-6 border-2 ${situation.bg} ${selected === situation.id ? "scale-95 opacity-80" : ""
              } ${situation.border
              } hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer overflow-hidden`}
          >
            {/* Blob decoration */}
            <div
              className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${situation.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />

            <div className="relative">
              {/* Tag */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${situation.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <situation.icon size={26} className={situation.iconColor} />
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${situation.tagBg}`}
                >
                  {situation.tag}
                </span>
              </div>

              <h3 className="text-slate-900 text-base mb-1.5" style={{ fontWeight: 700 }}>
                {situation.title}
              </h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{situation.desc}</p>

              <div
                className={`flex items-center gap-1.5 text-sm font-semibold ${situation.textColor} group-hover:gap-2.5 transition-all duration-200`}
              >
                {s.getGuidance}
                <ArrowRight size={14} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-base font-medium">{s.noSituations}</p>
          <p className="text-sm mt-1">{s.noSituationsDesc}</p>
        </div>
      )}

      {/* Voice Input Section */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-8">
        <p className="text-slate-600 text-base mb-2" style={{ fontWeight: 600 }}>
          {s.dontSeeTitle}
        </p>
        <p className="text-slate-500 text-sm mb-6">{s.dontSeeDesc}</p>

        <button
          onClick={handleVoiceAssistant} className={`relative w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 shadow-2xl ${listening
              ? "bg-red-500 shadow-red-200 scale-110"
              : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-200 hover:scale-110 hover:shadow-xl"
            }`}
        >
          {listening && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
              <div className="absolute inset-[-8px] rounded-full bg-red-400/20 animate-pulse" />
            </>
          )}
          {listening ? (
            <MicOff size={30} className="text-white relative z-10" />
          ) : (
            <Mic size={30} className="text-white relative z-10" />
          )}
        </button>

        <p
          className={`mt-4 text-sm font-medium transition-colors duration-200 ${listening ? "text-red-500" : "text-slate-500"
            }`}
        >
          {listening ? s.listening : s.tapToSpeak}
        </p>

        {listening && (
          <div className="mt-4 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-red-400 rounded-full animate-bounce"
                style={{
                  height: `${Math.random() * 20 + 8}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
