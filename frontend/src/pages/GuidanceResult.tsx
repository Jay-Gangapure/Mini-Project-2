import { useParams, useNavigate } from "react-router";
import {
  ShieldCheck,
  ListChecks,
  XCircle,
  Zap,
  Phone,
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCheck,
  AlertTriangle,
  Car,
  Wallet,
  Monitor,
  Home,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { useTranslation, getLangFont } from "../i18n/useTranslation";

const SITUATION_DATA: Record<
  string,
  {
    title: string;
    icon: React.ElementType;
    color: string;
    rights: string[];
    shouldDo: string[];
    shouldNotDo: string[];
    immediateActions: string[];
    helplines: { name: string; number: string; desc: string }[];
  }
> = {
  "traffic-police": {
    title: "Traffic Police Stopped You",
    icon: Car,
    color: "text-blue-600",
    rights: [
      "You have the right to know why you've been stopped.",
      "You cannot be detained without reason for more than 30 minutes.",
      "You have the right to see the officer's badge number and ID.",
      "Your vehicle cannot be seized without a valid challan receipt.",
      "You have the right to a fair hearing before any penalty is imposed.",
    ],
    shouldDo: [
      "Stay calm and be polite — do not argue aggressively.",
      "Ask the officer for their name and badge number.",
      "Request a proper printed challan receipt if fined.",
      "Note the time, location, and officer details.",
      "Pay challan online at https://echallan.parivahan.gov.in to avoid excess charges.",
    ],
    shouldNotDo: [
      "Do NOT pay bribe — it's illegal and you could be charged too.",
      "Do NOT leave without getting a receipt for any payment.",
      "Do NOT give away original documents — show only; don't hand over.",
      "Do NOT argue violently — it can escalate and lead to arrest.",
    ],
    immediateActions: [
      "📸 Discreetly note the officer's name/badge if safe to do so.",
      "📱 Call someone to inform about your location.",
      "📄 Demand a proper written challan.",
      "🚔 If harassed, call PCR: 112 immediately.",
    ],
    helplines: [
      { name: "Police Emergency", number: "100", desc: "Immediate police assistance" },
      { name: "PCR Van", number: "112", desc: "Emergency response" },
      { name: "Traffic Helpline", number: "1099", desc: "Traffic police complaints" },
      { name: "Anti-Corruption", number: "1064", desc: "Report bribery" },
    ],
  },
  "salary-not-paid": {
    title: "Salary Not Paid by Employer",
    icon: Wallet,
    color: "text-green-600",
    rights: [
      "Under the Payment of Wages Act, salary must be paid by the 7th (or 10th for large firms) of every month.",
      "You are entitled to full salary as per your appointment letter.",
      "Withholding salary is a criminal offense under Section 406 IPC.",
      "You can claim 3x the unpaid amount as compensation.",
      "You cannot be terminated for claiming unpaid wages.",
    ],
    shouldDo: [
      "Send a formal written complaint email to HR and your manager.",
      "Keep all salary slips, appointment letter, and bank statements.",
      "File a complaint with the Labour Commissioner's office.",
      "Contact your state's Industrial Tribunal or Labour Court.",
      "File online complaint at Shram Suvidha Portal: shramsuvidha.gov.in",
    ],
    shouldNotDo: [
      "Do NOT abandon work without written notice — it may hurt your case.",
      "Do NOT sign any settlement without reading carefully.",
      "Do NOT delete your work emails — they are evidence.",
      "Do NOT accept partial payment without writing 'paid under protest'.",
    ],
    immediateActions: [
      "📧 Email HR immediately — create a paper trail.",
      "📋 File complaint at Labour Commissioner within 1 year.",
      "📱 Call Labour Helpline: 1800-11-9191",
      "🏛️ Approach Shram Vivaad helpdesk in your state.",
    ],
    helplines: [
      { name: "Labour Helpline", number: "1800-11-9191", desc: "Free labour complaint helpline" },
      { name: "EPFO Helpline", number: "1800-118-005", desc: "PF related issues" },
      { name: "ESI Helpline", number: "1800-11-3839", desc: "ESI related grievances" },
    ],
  },
  "cyber-fraud": {
    title: "Cyber Fraud / Online Scam",
    icon: Monitor,
    color: "text-red-600",
    rights: [
      "You have the right to report cybercrime at cybercrime.gov.in or 1930.",
      "Banks must reverse fraudulent transactions within 7 working days.",
      "RBI mandates zero liability if fraud is reported within 3 days.",
      "You are protected under IT Act 2000, Section 66C and 66D.",
      "FIR must be registered within 24 hours of reporting.",
    ],
    shouldDo: [
      "🚨 IMMEDIATELY call 1930 (Cyber Crime Helpline) — every minute matters.",
      "Report on cybercrime.gov.in portal right away.",
      "Call your bank's 24x7 helpline to block transactions.",
      "Take screenshots of all fraudulent messages/transactions.",
      "Change all passwords and enable 2FA immediately.",
    ],
    shouldNotDo: [
      "Do NOT transfer more money hoping to 'recover' previous loss.",
      "Do NOT delete messages or transaction history.",
      "Do NOT share OTP with anyone claiming to be from bank/police.",
      "Do NOT click any more links from unknown senders.",
    ],
    immediateActions: [
      "📞 CALL 1930 RIGHT NOW — freeze the fraudulent transaction.",
      "🏦 Call your bank: Block all cards and report fraud.",
      "📱 Register complaint at cybercrime.gov.in",
      "🚔 File FIR at local cyber police station.",
    ],
    helplines: [
      {
        name: "🚨 Cyber Crime Helpline",
        number: "1930",
        desc: "Report cybercrime IMMEDIATELY",
      },
      {
        name: "Cyber Crime Portal",
        number: "cybercrime.gov.in",
        desc: "Online complaint registration",
      },
      { name: "RBI Helpline", number: "14440", desc: "Banking fraud complaints" },
    ],
  },
  "landlord-issue": {
    title: "Landlord / Rent Issue",
    icon: Home,
    color: "text-amber-600",
    rights: [
      "A landlord cannot forcibly evict you without a court order.",
      "You have the right to 30 days written notice before eviction.",
      "Security deposit refund must happen within 30 days of vacating.",
      "Landlord cannot cut electricity/water to force you out.",
      "You are protected under the Rent Control Act in your state.",
    ],
    shouldDo: [
      "Always have a registered rent agreement — it's your protection.",
      "Send all complaints via written/email so there's a record.",
      "File a complaint with Rent Authority in your city.",
      "Approach Consumer Forum if utility services are cut.",
      "Contact Lok Adalat for fast, free resolution.",
    ],
    shouldNotDo: [
      "Do NOT vacate without a written receipt for belongings.",
      "Do NOT pay extra without written agreement.",
      "Do NOT allow landlord entry without notice (except emergency).",
      "Do NOT stop paying rent — pay and dispute, don't withhold.",
    ],
    immediateActions: [
      "📝 Document all verbal disputes via SMS/email follow-up.",
      "🏛️ File complaint at District Rent Authority.",
      "📞 Call Legal Aid: 15100 for free legal help.",
      "🚔 If threatened with violence, call Police: 100.",
    ],
    helplines: [
      { name: "Police", number: "100", desc: "If threatened with force" },
      { name: "NALSA Legal Aid", number: "15100", desc: "Free legal aid" },
      { name: "Consumer Forum", number: "1800-11-4000", desc: "Consumer disputes" },
    ],
  },
  "consumer-complaint": {
    title: "Consumer Complaint",
    icon: ShoppingBag,
    color: "text-purple-600",
    rights: [
      "You have the right to refund/replacement for defective products (Consumer Protection Act 2019).",
      "Services must meet promised standards.",
      "You can claim compensation for mental agony caused by poor service.",
      "Online grievance can be filed at consumerhelpline.gov.in.",
      "You are protected against unfair trade practices.",
    ],
    shouldDo: [
      "Register complaint at consumerhelpline.gov.in or NCH: 1800-11-4000.",
      "Keep all receipts, invoices, screenshots as evidence.",
      "Give company a written notice before filing forum complaint.",
      "Approach District Consumer Forum for disputes under ₹1 crore.",
      "File within 2 years of the cause of action.",
    ],
    shouldNotDo: [
      "Do NOT destroy packaging or defective products before documentation.",
      "Do NOT accept replacement without written record.",
      "Do NOT miss the 2-year limitation period.",
      "Do NOT pay for 'repair' of a new defective product.",
    ],
    immediateActions: [
      "📸 Document all evidence: photos, screenshots, receipts.",
      "📧 Email company formally with complaint reference.",
      "📞 Call NCH: 1800-11-4000 (National Consumer Helpline).",
      "🌐 Register at consumerhelpline.gov.in",
    ],
    helplines: [
      {
        name: "National Consumer Helpline",
        number: "1800-11-4000",
        desc: "Free consumer complaints",
      },
      { name: "NCH SMS", number: "8800001915", desc: "SMS for complaint registration" },
      {
        name: "INGRAM Portal",
        number: "consumerhelpline.gov.in",
        desc: "Online complaint portal",
      },
    ],
  },
  "domestic-violence": {
    title: "Domestic Violence Help",
    icon: Heart,
    color: "text-pink-600",
    rights: [
      "You are protected under the Protection of Women from Domestic Violence Act, 2005.",
      "You have the right to live in the shared household — cannot be thrown out.",
      "You can get a Protection Order from Magistrate within 3 days.",
      "Monetary relief and custody of children can be sought.",
      "Both physical and mental abuse are covered under the law.",
    ],
    shouldDo: [
      "🚨 Call Women's Helpline: 181 or Emergency: 112 immediately.",
      "Reach a safe location — go to a neighbor, relative, or shelter.",
      "Document injuries with photos and get medical certificate.",
      "Contact Protection Officer in your district.",
      "File FIR at police station or approach Magistrate directly.",
    ],
    shouldNotDo: [
      "Do NOT try to handle it alone — please seek help.",
      "Do NOT delete evidence: keep all photos, messages, records.",
      "Do NOT be pressured into withdrawing a complaint.",
      "Do NOT return home alone without ensuring your safety.",
    ],
    immediateActions: [
      "🚨 CALL 112 (Emergency) or 181 (Women Helpline) NOW.",
      "🏥 Seek medical attention — get a medical certificate.",
      "🏛️ Approach nearest Police Station or Magistrate.",
      "🏠 Go to government shelter: One Stop Centre (1800-11-1298).",
    ],
    helplines: [
      { name: "🚨 Women Helpline", number: "181", desc: "24x7 women's helpline" },
      { name: "Emergency", number: "112", desc: "Immediate emergency response" },
      { name: "One Stop Centre", number: "1800-11-1298", desc: "Shelter and legal help" },
      {
        name: "NCW Helpline",
        number: "7827170170",
        desc: "National Commission for Women",
      },
    ],
  },
};

export default function GuidanceResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const g = t.guidance;
  const fontFamily = getLangFont(lang);

  const [copied, setCopied] = useState<string | null>(null);

  const data = id ? SITUATION_DATA[id] : null;

  const SECTIONS = [
    {
      key: "rights",
      title: g.sections.rights,
      icon: ShieldCheck,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      badge: "bg-green-100 text-green-700",
    },
    {
      key: "shouldDo",
      title: g.sections.shouldDo,
      icon: ListChecks,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      badge: "bg-blue-100 text-blue-700",
    },
    {
      key: "shouldNotDo",
      title: g.sections.shouldNotDo,
      icon: XCircle,
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      badge: "bg-red-100 text-red-700",
    },
    {
      key: "immediateActions",
      title: g.sections.immediateActions,
      icon: Zap,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      badge: "bg-amber-100 text-amber-700",
    },
    {
      key: "helplines",
      title: g.sections.helplines,
      icon: Phone,
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      badge: "bg-purple-100 text-purple-700",
    },
  ];

  if (!data) {
    return (
      <div className="p-8 text-center" style={{ fontFamily }}>
        <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">{g.situationNotFound}</h2>
        <button
          onClick={() => navigate("/situation")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← {g.backToSituations}
        </button>
      </div>
    );
  }

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(num);
    setTimeout(() => setCopied(null), 2000);
  };

  const SectionIcon = data.icon;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto" style={{ fontFamily }}>
      {/* Back */}
      <button
        onClick={() => navigate("/situation")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        />
        {g.backToSituations}
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full" />
        <div className="relative flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <SectionIcon size={28} className="text-white" />
          </div>
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">{g.legalGuidanceFor}</p>
            <h1 className="text-2xl md:text-3xl mb-2" style={{ fontWeight: 800 }}>
              {data.title}
            </h1>
            <p className="text-blue-200 text-sm">{g.basedOn}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {SECTIONS.map((section) => {
          const SIcon = section.icon;
          const items = (data as any)[section.key];
          const isHelplines = section.key === "helplines";

          return (
            <div
              key={section.key}
              className={`rounded-2xl border ${section.bg} ${section.border} overflow-hidden`}
            >
              <div className={`flex items-center gap-3 px-5 py-4 border-b ${section.border}`}>
                <div
                  className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center`}
                >
                  <SIcon size={18} className={section.color} />
                </div>
                <h2 className={`${section.color} text-base`} style={{ fontWeight: 700 }}>
                  {section.title}
                </h2>
                <span
                  className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold ${section.badge}`}
                >
                  {Array.isArray(items) ? items.length : 0} {t.common.items}
                </span>
              </div>

              <div className="p-5">
                {isHelplines ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(items as typeof data.helplines).map((h, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 border border-purple-100 flex items-center justify-between gap-3 group hover:shadow-md transition-all duration-200"
                      >
                        <div>
                          <p className="text-slate-800 text-sm font-semibold">{h.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{h.desc}</p>
                          <p className="text-purple-700 font-bold text-base mt-1">{h.number}</p>
                        </div>
                        <button
                          onClick={() => copyNumber(h.number)}
                          className="p-2 rounded-lg hover:bg-purple-50 transition-colors text-purple-400 hover:text-purple-600 flex-shrink-0"
                          title={t.common.copyNumber}
                        >
                          {copied === h.number ? (
                            <CheckCheck size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {(items as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full ${section.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${section.color}`}
                        >
                          {i + 1}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-slate-500 text-sm leading-relaxed">
          <span className="font-semibold text-slate-600">{t.common.disclaimer}:</span>{" "}
          {g.disclaimerText}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg"
        >
          {g.askAI}
          <ExternalLink size={14} />
        </button>
        <button
          onClick={() => navigate("/directory")}
          className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all duration-200"
        >
          {g.findLegalHelp}
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
