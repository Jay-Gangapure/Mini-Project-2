import {
  MapPin,
  Phone,
  Search,
  Scale,
  Shield,
  Heart,
  MessageSquare,
  Star,
  Clock,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { useTranslation, getLangFont } from "../i18n/useTranslation";
import { useState } from "react";

const STATES = [
  "All India",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Uttar Pradesh",
  "West Bengal",
  "Rajasthan",
];

const DISTRICTS: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Delhi: ["Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Hubli-Dharwad", "Mangaluru"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
};

const CAT_KEYS = ["All", "Legal Aid", "Police", "Women Help", "Consumer", "NGO"];

const DIRECTORY = [
  {
    id: 1,
    name: "District Legal Services Authority",
    category: "Legal Aid",
    icon: Scale,
    color: "text-blue-600",
    bg: "bg-blue-50",
    state: "Maharashtra",
    district: "Mumbai",
    address: "City Civil Court, Fort, Mumbai, Maharashtra 400032",
    mapsUrl: "https://www.google.com/maps?q=City+Civil+Court+Fort+Mumbai",
    phones: ["022-22696247", "15100"],
    hours: "Mon-Sat, 10am-5pm",
    services: ["Free Legal Aid", "Lok Adalat", "Legal Advice"],
    rating: 4.5,
    free: true,
  },
  {
    id: 2,
    name: "Cyber Crime Police Station",
    category: "Police",
    icon: Shield,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    state: "Maharashtra",
    district: "Mumbai",
    address: "BKC Cyber Police Station, Bandra East, Mumbai 400051",
    mapsUrl: "https://www.google.com/maps?q=BKC+Cyber+Police+Station+Mumbai",
    phones: ["1930", "022-26541500"],
    hours: "24x7",
    services: ["Cyber Fraud FIR", "Online Scam Report"],
    rating: 4.2,
    free: true,
  },
  {
    id: 3,
    name: "One Stop Centre - Sakhi",
    category: "Women Help",
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    state: "Delhi",
    district: "Central Delhi",
    address: "RML Hospital Campus, Connaught Place, New Delhi",
    mapsUrl: "https://www.google.com/maps?q=RML+Hospital+Delhi",
    phones: ["181", "011-23361234"],
    hours: "24x7",
    services: ["Women Protection", "Shelter", "Legal Aid"],
    rating: 4.8,
    free: true,
  },
  {
    id: 4,
    name: "District Consumer Forum",
    category: "Consumer",
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-50",
    state: "Karnataka",
    district: "Bengaluru Urban",
    address: "Mayo Hall, MG Road, Bengaluru 560001",
    mapsUrl: "https://www.google.com/maps?q=Mayo+Hall+Bangalore",
    phones: ["1800-11-4000"],
    hours: "Mon-Fri, 10:30am-5pm",
    services: ["Consumer Complaints", "Refund Cases"],
    rating: 4.0,
    free: true,
  },
  {
    id: 5,
    name: "NALSA Legal Aid Centre",
    category: "Legal Aid",
    icon: Scale,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    state: "Delhi",
    district: "South Delhi",
    address: "Supreme Court Complex, Tilak Marg, New Delhi 110001",
    mapsUrl: "https://www.google.com/maps?q=Supreme+Court+of+India",
    phones: ["15100"],
    hours: "Mon-Fri, 9am-6pm",
    services: ["Free Lawyers", "Legal Help"],
    rating: 4.7,
    free: true,
  },
  {
    id: 6,
    name: "All Women Police Station",
    category: "Women Help",
    icon: Shield,
    color: "text-rose-600",
    bg: "bg-rose-50",
    state: "Tamil Nadu",
    district: "Chennai",
    address: "Egmore Women Police Station, Chennai 600008",
    mapsUrl: "https://www.google.com/maps?q=Egmore+Women+Police+Station",
    phones: ["181"],
    hours: "24x7",
    services: ["Harassment Cases", "DV FIR"],
    rating: 4.6,
    free: true,
  },
  {
    id: 7,
    name: "Labour Commissioner Office",
    category: "Legal Aid",
    icon: Scale,
    color: "text-amber-600",
    bg: "bg-amber-50",
    state: "Gujarat",
    district: "Ahmedabad",
    address: "Labour Office, Khanpur, Ahmedabad 380001",
    mapsUrl: "https://www.google.com/maps?q=Labour+Office+Ahmedabad",
    phones: ["079-25506001"],
    hours: "Mon-Sat, 10am-6pm",
    services: ["Wage Disputes", "Labor Law Help"],
    rating: 4.1,
    free: true,
  },
  {
    id: 8,
    name: "Common Service Centre (CSC)",
    category: "NGO",
    icon: MessageSquare,
    color: "text-teal-600",
    bg: "bg-teal-50",
    state: "Uttar Pradesh",
    district: "Lucknow",
    address: "CSC Center, Hazratganj, Lucknow 226001",
    mapsUrl: "https://www.google.com/maps?q=CSC+Lucknow",
    phones: ["1800-3000-3468"],
    hours: "Mon-Sat, 9am-7pm",
    services: ["Govt Services", "Documents Help"],
    rating: 4.3,
    free: true,
  },
];

export default function LegalDirectory() {
  const { t, lang } = useTranslation();
  const dir = t.directory;
  const fontFamily = getLangFont(lang);

  const [search, setSearch] = useState("");
  const [state, setState] = useState("All India");
  const [district, setDistrict] = useState("All");
  const [category, setCategory] = useState("All");

  const districts = state !== "All India" ? DISTRICTS[state] || [] : [];

  const filtered = DIRECTORY.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.services.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchState = state === "All India" || d.state === state;
    const matchDistrict = district === "All" || d.district === district;
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchState && matchDistrict && matchCat;
  });

  // ✅ NEW FUNCTION: Open Google Maps with address
  const openDirections = (address: string) => {
    const encoded = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm px-4 py-1.5 rounded-full mb-3 font-medium">
          <MapPin size={14} />
          {dir.badge}
        </div>
        <h1 className="text-slate-900 text-2xl md:text-3xl mb-2" style={{ fontWeight: 800 }}>
          {dir.title}
        </h1>
        <p className="text-slate-500">{dir.subtitle}</p>
      </div>

      {/* Filters */}
      {/* ...NO CHANGES HERE... */}

      {/* Emergency hotlines banner */}
      {/* ...NO CHANGES HERE... */}

      {/* Count */}
      <p className="text-slate-500 text-sm mb-4">
        <span className="font-semibold text-slate-800">{filtered.length}</span>{" "}
        {t.common.centersFound}
      </p>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${center.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <center.icon size={22} className={center.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-slate-900 font-bold text-base">{center.name}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${center.bg} ${center.color}`}
                        >
                          {center.category}
                        </span>
                        {center.free && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            {t.common.freeService}
                          </span>
                        )}
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-slate-500 text-xs font-medium">
                            {center.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <MapPin size={14} className="flex-shrink-0 mt-0.5 text-slate-400" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={14} className="flex-shrink-0 text-slate-400" />
                      <span>{center.hours}</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {center.services.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {center.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors"
                      >
                        <Phone size={13} />
                        {phone}
                      </a>
                    ))}

                    <a
                      href={center.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Navigation size={13} />
                      {t.common.getDirections}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <MapPin size={48} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">{dir.noResults}</p>
          <p className="text-slate-400 text-sm mt-1">{dir.noResultsDesc}</p>
        </div>
      )}
    </div>
  );
}