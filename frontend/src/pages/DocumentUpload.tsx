import { useState, useRef, useCallback } from "react";
import { playVoice, stopVoice } from "../services/voice_service";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  Loader2,
  Eye,
  Download,
  Sparkles,
  AlertCircle,
  File,
  FileImage,
  Lock,
} from "lucide-react";
import { useTranslation, getLangFont } from "../i18n/useTranslation";
import { useDashboard } from "../context/DashboardContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
type UploadStatus = "idle" | "uploading" | "analyzing" | "done" | "error";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(type: string) {
  if (type.includes("image")) return FileImage;
  if (type.includes("pdf")) return FileText;
  return File;
}

export default function DocumentUpload() {
  const { t, lang } = useTranslation();
  const d = t.documents;
  const fontFamily = getLangFont(lang);

  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<any>(null);
  const [voiceLang, setVoiceLang] = useState(lang || "en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { addNotification } = useDashboard();
  const { addActivity } = useDashboard();
  const summaryRef = useRef<HTMLDivElement>(null);

  const processFile = useCallback(
    (f: File) => {
      if (f.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB");
        return;
      }

      setFile({ name: f.name, size: f.size, type: f.type });
      setStatus("uploading");
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);

            // 👉 START ANALYZING
            setStatus("analyzing");

            // 👉 CALL API HERE (FIXED)
            const uploadFile = async () => {
              const formData = new FormData();
              formData.append("file", f);

              try {
                const res = await fetch("http://localhost:8000/documents/upload", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: formData,
                });

                const data = await res.json();
                console.log("API RESPONSE:", data);

                // ✅ STORE REAL DATA
                setResult(data.data);

                setStatus("done");
                addNotification({
                  title: "Document Analysed",
                  message: f.name + " analysed successfully",
                });

                addActivity({
                  title: "Document Uploaded",
                  description: f.name,
                  type: "document",
                });
              } catch (err) {
                console.error(err);
                setStatus("error");
              }
            };

            uploadFile(); // ✅ IMPORTANT (you forgot to call it)

            return 100;
          }
          return p + 10;
        });
      }, 150);
    },
    []
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getVoiceText = () => {
    return (
      result?.analysis ||
      result?.summary ||
      "No analysis available"
    )
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/\n/g, " ");
  };

  const handleSpeak = (text: string) => {
    playVoice(text, voiceLang, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  const formatAnalysis = (text: string) => {
    if (!text) return null;

    const cleanedText = text
      .replace(/\*/g, "")
      .replace(/#+/g, "")
      .trim();

    const lines = cleanedText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    interface Section {
      title: string;
      items: string[];
    }

    const sections: Section[] = [];

    let currentSection: Section = {
      title: "Summary",
      items: [],
    };

    const isHeading = (line: string) => {
      return (
        /situation|legal|points|contact|note|should do|should not do|summary|परिस्थिती|परिस्थिति|मुख्य|संपर्क|कायदेशीर|करावे|नको|महत्वाचे/i.test(
          line
        ) && line.length < 80
      );
    };

    lines.forEach((line) => {
      if (isHeading(line)) {
        if (
          currentSection.title ||
          currentSection.items.length > 0
        ) {
          sections.push(currentSection);
        }

        currentSection = {
          title: line.replace(/^\d+\./, "").trim(),
          items: [],
        };
      } else {
        currentSection.items.push(
          line.replace(/^[-•]/, "").trim()
        );
      }
    });

    if (currentSection.items.length > 0) {
      sections.push(currentSection);
    }

    return (
      <div className="space-y-5">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/10 border border-white/10 rounded-3xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg">
                {index === 0 && "⚖️"}
                {index === 1 && "📋"}
                {index === 2 && "⚠️"}
                {index === 3 && "📞"}
                {index > 3 && "📌"}
              </div>

              <h3 className="text-lg font-bold text-white">
                {section.title}
              </h3>
            </div>

            <div className="space-y-3">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/30 border border-white/5 rounded-2xl p-4 text-sm leading-relaxed text-blue-50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const FileIcon = file ? getFileIcon(file.type) : FileText;

  const INFO_CARDS = [
    {
      icon: Lock,
      title: d.infoCards.secure.title,
      desc: d.infoCards.secure.desc,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Sparkles,
      title: d.infoCards.ai.title,
      desc: d.infoCards.ai.desc,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: AlertCircle,
      title: d.infoCards.flags.title,
      desc: d.infoCards.flags.desc,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];
  const downloadSummaryPDF = async () => {
  try {
    if (!summaryRef.current) {
      alert("Summary not found");
      return;
    }

    // Clone element
    const element = summaryRef.current.cloneNode(true) as HTMLElement;

    // Create hidden container
    const container = document.createElement("div");

    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.width = "800px";
    container.style.background = "#ffffff";
    container.style.padding = "20px";
    container.style.zIndex = "-1";

    // FORCE SAFE COLORS
    element.style.background = "#ffffff";
    element.style.color = "#000000";

    // Remove problematic Tailwind styles
    const allElements = element.querySelectorAll("*");

    allElements.forEach((el: any) => {
      el.style.color = "#000000";
      el.style.backgroundColor = "#ffffff";
      el.style.borderColor = "#d1d5db";

      // Remove gradients
      el.style.backgroundImage = "none";

      // Remove shadows
      el.style.boxShadow = "none";

      // Remove backdrop blur
      el.style.backdropFilter = "none";
    });

    container.appendChild(element);
    document.body.appendChild(container);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(`NyaySathi_Summary_${Date.now()}.pdf`);

  } catch (error) {
    console.error("PDF DOWNLOAD ERROR:", error);
    alert("Failed to download PDF");
  }
};
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto" style={{ fontFamily }}>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm px-4 py-1.5 rounded-full mb-3 font-medium">
          <FileText size={14} />
          {d.badge}
        </div>
        <h1 className="text-slate-900 text-2xl md:text-3xl mb-2" style={{ fontWeight: 800 }}>
          {d.title}
        </h1>
        <p className="text-slate-500">{d.subtitle}</p>
      </div>

      {status === "idle" && (
        /* Upload Zone */
        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${dragOver
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            onChange={onFileChange}
          />

          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 ${dragOver ? "bg-blue-600 shadow-2xl shadow-blue-200 scale-110" : "bg-blue-50"
              }`}
          >
            <Upload
              size={34}
              className={`transition-colors duration-300 ${dragOver ? "text-white" : "text-blue-500"
                }`}
            />
          </div>

          <h3 className="text-slate-800 text-lg mb-2" style={{ fontWeight: 700 }}>
            {dragOver ? d.releaseToUpload : d.dragDrop}
          </h3>
          <p className="text-slate-500 mb-4 text-sm">{d.orClickBrowse}</p>

          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">
            <Upload size={16} />
            {d.chooseFile}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["PDF", "DOC/DOCX", "JPG/PNG", "TXT"].map((fmt) => (
              <span key={fmt} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {fmt}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-3">{d.maxSize}</p>
        </div>
      )}

      {(status === "uploading" || status === "analyzing") && file && (
        /* Progress */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileIcon size={26} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 font-semibold truncate">{file.name}</p>
              <p className="text-slate-400 text-sm">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={reset}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {status === "uploading" && (
            <div>
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>{d.uploading}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === "analyzing" && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-3 text-blue-600">
                <Loader2 size={24} className="animate-spin" />
                <span className="font-medium">{d.analyzing}</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">{d.analyzingTime}</p>
            </div>
          )}
        </div>
      )}

      {status === "done" && file && (
        /* Results */
        <div className="space-y-5">

          {/* File info card */}
          <div className="bg-white rounded-2xl border border-green-100 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FileIcon size={22} className="text-green-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-slate-900 font-semibold truncate">{file.name}</p>
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              </div>
              <p className="text-slate-400 text-sm">
                {formatSize(file.size)} • {d.analysisComplete}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                <Eye size={16} />
              </button>
              <button className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                <Download size={16} />
              </button>
              <button
                onClick={reset}
                className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 🌐 Language Selector */}
          <div className="flex justify-end">
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value as "en" | "hi" | "mr")}
              className="border px-2 py-1 rounded text-xs"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>

          {/* AI Summary */}
          <div
            ref={summaryRef}
            className="bg-white p-6 rounded-2xl"  
            style={{
              fontFamily: "'Noto Sans Devanagari', sans-serif",
            }}
          >
            <div
              className="bg-[#162456] rounded-2xl p-6 text-white"
              style={{
                fontFamily:
                  "'Noto Sans Devanagari', sans-serif",
              }}
            >              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-yellow-300" />
                </div>
                <div>
                  <p className="font-bold">{d.aiSummaryTitle}</p>
                  <p className="text-blue-300 text-sm">{d.aiSummaryTagline}</p>
                </div>

                {/* 🔊 Voice Button */}
                <div className="ml-auto flex items-center gap-3">
                  <span className="bg-blue-700/50 text-blue-200 text-xs px-3 py-1.5 rounded-full font-medium">
                    AI Analysis
                  </span>

                  <button
                    onClick={() => handleSpeak(getVoiceText())}
                    className="bg-white/30 hover:bg-white/50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="Read AI Analysis aloud"
                  >
                    <span>🔊</span>
                    <span className="hidden sm:inline">Listen</span>
                  </button>

                  {isSpeaking && (
                    <button
                      onClick={stopVoice}
                      className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Stop voice playback"
                    >
                      <span>⏹️</span>
                      <span className="hidden sm:inline">Stop</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                {formatAnalysis(result?.analysis)}
              </div>

              <div className="mt-4 flex items-center gap-2 text-blue-300 text-xs">
                <Lock size={12} />
                {d.secureNote}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-200"
            >
              <Upload size={14} />
              {d.uploadAnother}
            </button>
            <button
              onClick={downloadSummaryPDF}
              className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >              <Download size={14} />
              {d.downloadSummary}
            </button>
          </div>
        </div>
      )}

      {/* Info cards */}
      {status === "idle" && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {INFO_CARDS.map((item) => (
            <div key={item.title} className={`${item.bg} rounded-2xl p-4 border border-slate-100`}>
              <item.icon size={20} className={`${item.color} mb-2`} />
              <p className="text-slate-800 font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
