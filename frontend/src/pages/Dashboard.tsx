import { Link, useNavigate } from "react-router";
import {
  AlertTriangle,
  MessageSquare,
  BookOpen,
  FileText,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Trash2,
  CheckSquare,
  Square,
  X
} from "lucide-react";
import { Mic, MicOff } from "lucide-react";

import useVoice from "../hooks/useVoiceInput";
import { playVoice } from "../services/voice_service";
import { useAuth } from "../context/AuthContext";
import { useTranslation, getLangFont } from "../i18n/useTranslation";
import NotificationDropdown from "../components/NotificationDropdown";
import { useDashboard } from "../context/DashboardContext";
import { formatTimeAgo } from "../utils/timeAgo";
import { useState } from "react";
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    addActivity,
    addNotification,
    incrementIssuesResolved,
  } = useDashboard();

  const [listening, setListening] =
    useState(false);
  const { t, lang } = useTranslation();

  const { uploadedDocuments, issuesResolved, schemesFound, activities, deleteActivities } = useDashboard();
  const d = t.dashboard;
  const fontFamily = getLangFont(lang);
  const {
    startListening,
    stopListening,
  } = useVoice(lang);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? d.greetingMorning : hour < 17 ? d.greetingAfternoon : d.greetingEvening;

  const [selectionMode, setSelectionMode] =
    useState(false);

  const [selectedActivities, setSelectedActivities] =
    useState<string[]>([]);
  const QUICK_ACTIONS = [
    {
      to: "/situation",
      icon: AlertTriangle,
      title: d.actions.situation.title,
      desc: d.actions.situation.desc,
      gradient: "from-red-500 to-orange-500",
      bg: "bg-red-50",
      border: "border-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      badge: d.actions.situation.badge,
      badgeColor: "bg-red-100 text-red-600",
    },
    {
      to: "/chat",
      icon: MessageSquare,
      title: d.actions.chat.title,
      desc: d.actions.chat.desc,
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: d.actions.chat.badge,
      badgeColor: "bg-blue-100 text-blue-600",
    },
    {
      to: "/schemes",
      icon: BookOpen,
      title: d.actions.schemes.title,
      desc: d.actions.schemes.desc,
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badge: d.actions.schemes.badge,
      badgeColor: "bg-green-100 text-green-600",
    },
    {
      to: "/documents",
      icon: FileText,
      title: d.actions.documents.title,
      desc: d.actions.documents.desc,
      gradient: "from-amber-500 to-yellow-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badge: d.actions.documents.badge,
      badgeColor: "bg-amber-100 text-amber-600",
    },
    {
      to: "/directory",
      icon: MapPin,
      title: d.actions.directory.title,
      desc: d.actions.directory.desc,
      gradient: "from-purple-500 to-violet-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: d.actions.directory.badge,
      badgeColor: "bg-purple-100 text-purple-600",
    },
  ];

  const STATS = [
    {
      icon: FileText,
      label: "Documents Uploaded",
      value: uploadedDocuments,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },

    {
      icon: CheckCircle2,
      label: d.issuesResolved,
      value: issuesResolved,
      color: "text-green-600",
      bg: "bg-green-50",
    },

    {
      icon: TrendingUp,
      label: d.schemesFoundStat,
      value: schemesFound,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];
  const handleVoiceAssistant = () => {

    if (listening) {
      stopListening();
      setListening(false);
      return;
    }

    setListening(true);

    startListening(
      (transcript: string) => {

        setListening(false);

        // SAVE ACTIVITY
        addActivity({
          title: "Voice Assistant Used",
          description: transcript,
          type: "rights",
        });

        // INCREMENT ISSUE COUNT
        incrementIssuesResolved();

        // ADD NOTIFICATION
        addNotification({
          title: "Voice Query Submitted",
          message:
            transcript.length > 60
              ? transcript.slice(0, 60) + "..."
              : transcript,
        });

        // OPTIONAL VOICE FEEDBACK
        playVoice(
          "Opening AI assistant",
          lang
        );

        // OPEN CHAT PAGE WITH QUERY
        navigate("/chat", {
          state: {
            voiceQuery: transcript,
          },
        });
      }
    );
  };
  const toggleActivitySelection = (
    id: string
  ) => {

    setSelectedActivities((prev) =>

      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]

    );
  };

  const handleSelectAll = () => {

    if (
      selectedActivities.length ===
      activities.length
    ) {

      setSelectedActivities([]);

    } else {

      setSelectedActivities(
        activities.map(
          (activity) => activity.id
        )
      );
    }
  };

  const handleDeleteActivities = () => {

    if (selectedActivities.length === 0)
      return;

    deleteActivities(selectedActivities);

    setSelectedActivities([]);

    setSelectionMode(false);
  };
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-slate-500 text-sm mb-1">
            {greeting} 👋
          </p>
          <h1 className="text-slate-900 text-2xl md:text-3xl" style={{ fontWeight: 800 }}>
            {d.welcomeMsg} {user?.name}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{d.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 shadow-sm">
            <NotificationDropdown />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Link
            to="/situation"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:scale-105"
          >
            <AlertTriangle size={16} />
            {t.common.getHelpNow}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-slate-100`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <s.icon size={18} className={s.color} />
              </div>
              <div>
                <div className={`text-2xl ${s.color}`} style={{ fontWeight: 800 }}>
                  {s.value}
                </div>
                <div className="text-slate-500 text-xs leading-tight">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Voice Input Section */}
      <div className="text-center mb-8 p-8">
        <p
          className="text-slate-800 text-lg mb-2"
          style={{ fontWeight: 900 }}
        >
          Emergency Voice Legal Assistant
        </p>

        <p className="text-slate-500 text-sm md:text-base mb-6 max-w-md mx-auto leading-relaxed" style={{ fontWeight: 500 }}>
          Speak naturally in English, Hindi, Marathi or your preferred language.

        </p>
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
          {listening
            ? "Listening carefully... please describe your situation"
            : "Tap the mic and explain your emergency"}
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

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900 text-lg" style={{ fontWeight: 700 }}>
            {d.quickActions}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`group relative rounded-2xl p-5 border ${action.bg} ${action.border} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
            >
              {/* Gradient blob */}
              <div
                className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${action.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon size={20} className={action.iconColor} />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${action.badgeColor}`}
                  >
                    {action.badge}
                  </span>
                </div>
                <h3 className="text-slate-900 mb-1 text-base" style={{ fontWeight: 700 }}>
                  {action.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{action.desc}</p>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${action.iconColor} group-hover:gap-2 transition-all duration-200`}
                >
                  {t.common.open}
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">

          <div>
            <h2
              className="text-slate-900 text-lg"
              style={{ fontWeight: 700 }}
            >
              Recent Activities
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Track all your latest actions
            </p>
          </div>

          <div className="flex items-center gap-2">

            {selectionMode && (
              <>
                {/* SELECT ALL */}

                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
                >

                  {selectedActivities.length ===
                    activities.length ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}

                  Select All
                </button>

                {/* DELETE */}

                <button
                  onClick={handleDeleteActivities}
                  className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                {/* CANCEL */}

                <button
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedActivities([]);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  <X size={16} />
                </button>
              </>
            )}

            {!selectionMode && (
              <button
                onClick={() =>
                  setSelectionMode(true)
                }
                className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all"
              >
                <Trash2 size={16} />
                Manage
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {activities.length === 0 ? (

            <div className="p-10 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Clock size={28} className="text-slate-400" />
              </div>

              <p className="text-slate-700 font-semibold">
                No recent activity
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Your actions will appear here
              </p>
            </div>

          ) : (

            activities.map((activity: any, i: number) => (

              <div
                key={activity.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-all duration-200 ${selectedActivities.includes(
                  activity.id
                )
                  ? "bg-blue-50"
                  : ""
                  } ${i !== activities.length - 1
                    ? "border-b border-slate-100"
                    : ""
                  }`}
              >
                {selectionMode && (

                  <button
                    onClick={() =>
                      toggleActivitySelection(
                        activity.id
                      )
                    }
                    className="flex-shrink-0"
                  >

                    {selectedActivities.includes(
                      activity.id
                    ) ? (

                      <CheckSquare
                        size={18}
                        className="text-blue-600"
                      />

                    ) : (

                      <Square
                        size={18}
                        className="text-slate-400"
                      />

                    )}

                  </button>

                )}

                {/* ICON */}

                <div
                  className={`
              w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0

              ${activity.type === "document"
                      ? "bg-amber-50"
                      : activity.type === "scheme"
                        ? "bg-purple-50"
                        : activity.type === "rights"
                          ? "bg-green-50"
                          : "bg-blue-50"
                    }
            `}
                >

                  {activity.type === "document" ? (
                    <FileText
                      size={20}
                      className="text-amber-600"
                    />
                  ) : activity.type === "scheme" ? (
                    <TrendingUp
                      size={20}
                      className="text-purple-600"
                    />
                  ) : activity.type === "rights" ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-600"
                    />
                  ) : (
                    <MessageSquare
                      size={20}
                      className="text-blue-600"
                    />
                  )}

                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between gap-3">

                    <p className="text-slate-800 font-semibold text-sm">
                      {activity.title}
                    </p>

                    <div className="flex items-center gap-1 text-slate-400 text-xs whitespace-nowrap">
                      <Clock size={12} />
                      {formatTimeAgo(activity.timestamp)}
                    </div>

                  </div>

                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    {activity.description}
                  </p>

                </div>

              </div>

            ))

          )}

        </div>
      </div>
    </div>
  );
}
