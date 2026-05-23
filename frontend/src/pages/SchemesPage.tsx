import { useState } from "react";
import {
  BookOpen,
  Search,
  ExternalLink,
  Filter,
  ChevronDown,
  IndianRupee,
  Users,
  Home,
  Heart,
  GraduationCap,
  Sprout,
  Briefcase,
} from "lucide-react";
import { useTranslation, getLangFont } from "../i18n/useTranslation";
import { useDashboard } from "../context/DashboardContext";

const SCHEMES = [
  {
    id: 1,
    name: "PM Awas Yojana (Urban)",
    category: "Housing",
    icon: Home,
    color: "text-blue-600",
    bg: "bg-blue-50",
    eligibility: "EWS/LIG/MIG families",
    benefit: "Up to ₹2.67 lakh subsidy on home loan",
    income: "Up to ₹18 lakh/year",
    gender: "All",
    state: "All India",
    link: "https://pmaymis.gov.in/",
    desc: "Affordable housing scheme with interest subsidy on home loans.",
  },
  {
    id: 2,
    name: "Ayushman Bharat - PMJAY",
    category: "Health",
    icon: Heart,
    color: "text-red-600",
    bg: "bg-red-50",
    eligibility: "Poor & vulnerable families",
    benefit: "₹5 lakh health insurance per family",
    income: "BPL families",
    gender: "All",
    state: "All India",
    link: "https://pmjay.gov.in/",
    desc: "Free health insurance for secondary & tertiary care.",
  },
  {
    id: 3,
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    icon: Sprout,
    color: "text-green-600",
    bg: "bg-green-50",
    eligibility: "Small & marginal farmers",
    benefit: "₹6000 per year",
    income: "All farmers",
    gender: "All",
    state: "All India",
    link: "https://pmkisan.gov.in/",
    desc: "Income support for farmers directly into bank accounts.",
  },
  {
    id: 4,
    name: "Pradhan Mantri Mudra Yojana",
    category: "Employment",
    icon: Briefcase,
    color: "text-amber-600",
    bg: "bg-amber-50",
    eligibility: "Entrepreneurs & MSMEs",
    benefit: "Loans up to ₹10 lakh",
    income: "Any",
    gender: "All",
    state: "All India",
    link: "https://www.mudra.org.in/",
    desc: "Business loan scheme for startups & small enterprises.",
  },
  {
    id: 5,
    name: "Sukanya Samriddhi Yojana",
    category: "Women",
    icon: GraduationCap,
    color: "text-pink-600",
    bg: "bg-pink-50",
    eligibility: "Girl child below 10",
    benefit: "High interest savings",
    income: "All",
    gender: "Female",
    state: "All India",
    link: "https://www.indiapost.gov.in/",
    desc: "Savings scheme for girl child's future.",
  },
  {
    id: 6,
    name: "E-Shram Card Scheme",
    category: "Employment",
    icon: Briefcase,
    color: "text-teal-600",
    bg: "bg-teal-50",
    eligibility: "Unorganized workers",
    benefit: "₹2 lakh accident insurance",
    income: "Below ₹10k/month",
    gender: "All",
    state: "All India",
    link: "https://eshram.gov.in/",
    desc: "Social security for unorganized sector workers.",
  },
  {
    id: 7,
    name: "Stand Up India Scheme",
    category: "Employment",
    icon: Briefcase,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    eligibility: "SC/ST/Women entrepreneurs",
    benefit: "Loans ₹10 lakh–₹1 crore",
    income: "Any",
    gender: "All",
    state: "All India",
    link: "https://www.standupmitra.in/",
    desc: "Promotes entrepreneurship among marginalized groups.",
  },
  {
    id: 8,
    name: "Startup India Scheme",
    category: "Employment",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
    eligibility: "Startups",
    benefit: "Tax exemptions & funding support",
    income: "Any",
    gender: "All",
    state: "All India",
    link: "https://www.startupindia.gov.in/",
    desc: "Support for startups with funding & compliance benefits.",
  },
  {
    id: 9,
    name: "Digital India Programme",
    category: "Education",
    icon: GraduationCap,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    eligibility: "All citizens",
    benefit: "Digital access to services",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://digitalindia.gov.in/",
    desc: "Promotes digital infrastructure and services.",
  },
  {
    id: 10,
    name: "PM Ujjwala Yojana",
    category: "Women",
    icon: Heart,
    color: "text-orange-600",
    bg: "bg-orange-50",
    eligibility: "BPL women",
    benefit: "Free LPG connection",
    income: "BPL",
    gender: "Female",
    state: "All India",
    link: "https://www.pmuy.gov.in/",
    desc: "Free LPG connections to poor households.",
  },
  {
    id: 11,
    name: "PM Suraksha Bima Yojana",
    category: "Health",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50",
    eligibility: "18–70 years",
    benefit: "₹2 lakh accident insurance",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://jansuraksha.gov.in/",
    desc: "Low-cost accident insurance scheme.",
  },
  {
    id: 12,
    name: "PM Jeevan Jyoti Bima Yojana",
    category: "Health",
    icon: Heart,
    color: "text-red-700",
    bg: "bg-red-50",
    eligibility: "18–50 years",
    benefit: "₹2 lakh life insurance",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://jansuraksha.gov.in/",
    desc: "Affordable life insurance scheme.",
  },
  {
    id: 13,
    name: "Atal Pension Yojana",
    category: "Employment",
    icon: Users,
    color: "text-blue-700",
    bg: "bg-blue-50",
    eligibility: "Unorganized workers",
    benefit: "₹1000–₹5000 monthly pension",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://www.npscra.nsdl.co.in/",
    desc: "Pension scheme for retirement security.",
  },
  {
    id: 14,
    name: "Skill India Mission",
    category: "Education",
    icon: GraduationCap,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    eligibility: "Youth",
    benefit: "Skill training & certification",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://skillindia.gov.in/",
    desc: "Vocational training to boost employability.",
  },
  {
    id: 15,
    name: "National Food Security Act",
    category: "Health",
    icon: Home,
    color: "text-green-700",
    bg: "bg-green-50",
    eligibility: "Poor families",
    benefit: "Subsidized food grains",
    income: "BPL",
    gender: "All",
    state: "All India",
    link: "https://nfsa.gov.in/",
    desc: "Provides affordable food grains to eligible households.",
  },
  {
    id: 16,
    name: "PM Fasal Bima Yojana",
    category: "Agriculture",
    icon: Sprout,
    color: "text-green-800",
    bg: "bg-green-50",
    eligibility: "Farmers",
    benefit: "Crop insurance",
    income: "All farmers",
    gender: "All",
    state: "All India",
    link: "https://pmfby.gov.in/",
    desc: "Insurance against crop failure.",
  },
  {
    id: 17,
    name: "PM Kaushal Vikas Yojana",
    category: "Education",
    icon: GraduationCap,
    color: "text-purple-700",
    bg: "bg-purple-50",
    eligibility: "Youth",
    benefit: "Free skill training",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://www.pmkvyofficial.org/",
    desc: "Skill development training programs.",
  },
  {
    id: 18,
    name: "National Scholarship Portal",
    category: "Education",
    icon: GraduationCap,
    color: "text-indigo-800",
    bg: "bg-indigo-50",
    eligibility: "Students",
    benefit: "Various scholarships",
    income: "Depends",
    gender: "All",
    state: "All India",
    link: "https://scholarships.gov.in/",
    desc: "Central portal for all scholarships.",
  },
  {
    id: 19,
    name: "Swachh Bharat Mission",
    category: "Health",
    icon: Home,
    color: "text-blue-800",
    bg: "bg-blue-50",
    eligibility: "All citizens",
    benefit: "Sanitation facilities",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://swachhbharatmission.gov.in/",
    desc: "Promotes cleanliness and sanitation.",
  },
  {
    id: 20,
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    category: "Employment",
    icon: Briefcase,
    color: "text-amber-700",
    bg: "bg-amber-50",
    eligibility: "Street vendors",
    benefit: "Working capital loan",
    income: "Low income",
    gender: "All",
    state: "All India",
    link: "https://pmsvanidhi.mohua.gov.in/",
    desc: "Financial support for street vendors.",
  },
  {
    id: 21,
    name: "Beti Bachao Beti Padhao",
    category: "Women",
    icon: Users,
    color: "text-pink-700",
    bg: "bg-pink-50",
    eligibility: "Girl child",
    benefit: "Awareness & support programs",
    income: "All",
    gender: "Female",
    state: "All India",
    link: "https://wcd.nic.in/",
    desc: "Promotes girl child education.",
  },
  {
    id: 22,
    name: "PM Garib Kalyan Anna Yojana",
    category: "Health",
    icon: Home,
    color: "text-green-900",
    bg: "bg-green-50",
    eligibility: "Poor families",
    benefit: "Free food grains",
    income: "BPL",
    gender: "All",
    state: "All India",
    link: "https://dfpd.gov.in/",
    desc: "Free ration scheme for poor households.",
  },
  {
    id: 23,
    name: "Make in India",
    category: "Employment",
    icon: Briefcase,
    color: "text-orange-700",
    bg: "bg-orange-50",
    eligibility: "Businesses",
    benefit: "Manufacturing support",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://www.makeinindia.com/",
    desc: "Encourages manufacturing in India.",
  },
  {
    id: 24,
    name: "PM Gram Sadak Yojana",
    category: "Housing",
    icon: Home,
    color: "text-blue-900",
    bg: "bg-blue-50",
    eligibility: "Rural areas",
    benefit: "Road connectivity",
    income: "All",
    gender: "All",
    state: "All India",
    link: "https://pmgsy.nic.in/",
    desc: "Improves rural road connectivity.",
  },
  {
    id: 25,
    name: "National Rural Livelihood Mission (NRLM)",
    category: "Employment",
    icon: Users,
    color: "text-teal-700",
    bg: "bg-teal-50",
    eligibility: "Rural poor",
    benefit: "Self-employment & SHGs",
    income: "Low income",
    gender: "All",
    state: "All India",
    link: "https://aajeevika.gov.in/",
    desc: "Supports rural livelihoods and SHGs.",
  },
];

// Map scheme category to translation index
const CAT_KEYS = ["All", "Housing", "Health", "Education", "Agriculture", "Employment", "Women"];
const GENDER_KEYS = ["All", "Male", "Female"];
const STATE_KEYS = ["All India"];

export default function SchemesPage() {
  const { t, lang } = useTranslation();
  const s = t.schemes;
  const fontFamily = getLangFont(lang);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [state, setState] = useState("All India");
  const [showFilters, setShowFilters] = useState(false);
  const { addActivity } = useDashboard();

  addActivity({
  title: "Scheme Searched",
  description: search,
  type: "scheme",
});
  const filtered = SCHEMES.filter((sc) => {
    const matchSearch =
      sc.name.toLowerCase().includes(search.toLowerCase()) ||
      sc.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || sc.category === category;
    const matchGender = gender === "All" || sc.gender === "All" || sc.gender === gender;
    const matchState = state === "All India" || sc.state === "All India" || sc.state === state;
    return matchSearch && matchCat && matchGender && matchState;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm px-4 py-1.5 rounded-full mb-3 font-medium">
          <BookOpen size={14} />
          {s.badge}
        </div>
        <h1 className="text-slate-900 text-2xl md:text-3xl mb-2" style={{ fontWeight: 800 }}>
          {s.title}
        </h1>
        <p className="text-slate-500">{s.subtitle}</p>
      </div>

      {/* Search & Filter bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={s.searchPlaceholder}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${showFilters
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
          >
            <Filter size={16} />
            {t.common.filters}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
            {/* Gender */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                {s.genderLabel}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-slate-50"
              >
                {GENDER_KEYS.map((g, i) => (
                  <option key={g} value={g}>
                    {s.genderOptions[i]}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                {s.stateLabel}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-slate-50"
              >
                {STATE_KEYS.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setGender("All");
                  setState("All India");
                  setCategory("All");
                  setSearch("");
                }}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
              >
                {t.common.resetFilters}
              </button>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CAT_KEYS.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${category === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {s.categories[i]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-500 text-sm">
          <span className="font-semibold text-slate-800">{filtered.length}</span>{" "}
          {t.common.schemesFound}
        </p>
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${scheme.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <scheme.icon size={22} className={scheme.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-slate-900 text-base leading-tight" style={{ fontWeight: 700 }}>
                      {scheme.name}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${scheme.bg} ${scheme.color}`}
                    >
                      {scheme.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{scheme.desc}</p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <IndianRupee size={14} className="text-green-600 flex-shrink-0" />
                  <span className="text-slate-500 text-sm">{s.benefitLabel}</span>
                  <span className="text-slate-800 text-sm font-semibold">{scheme.benefit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-blue-600 flex-shrink-0" />
                  <span className="text-slate-500 text-sm">{s.eligibilityLabel}</span>
                  <span className="text-slate-800 text-sm font-medium">{scheme.eligibility}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">{s.incomeLabel}</span>
                    <span className="text-slate-700 text-xs font-medium">{scheme.income}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">{s.genderFilterLabel}</span>
                    <span className="text-slate-700 text-xs font-medium">{scheme.gender}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                {t.common.applyLearnMore}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">{s.noSchemes}</p>
          <p className="text-sm mt-1">{s.noSchemesDesc}</p>
        </div>
      )}
    </div>
  );
}