import { Mic } from "lucide-react";
import useVoice from "../hooks/useVoiceInput";

interface Props {
  lang: string;
}

export default function VoiceAssistantCard({
  lang,
}: Props) {
  const {
    listening,
    startListening,
    stopListening,
  } = useVoice(lang);

  const handleTranscript = (text: string) => {
    console.log("Voice input:", text);
  };

  return (
    <div className="rounded-3xl border bg-gradient-to-r from-blue-50 to-pink-50 p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Talk to NyaySathi AI ✨
        </h2>

        <p className="text-slate-500 mt-2">
          Multilingual Legal Voice Assistant
        </p>

        <button
          onClick={() => {
            if (listening) {
              stopListening();
            } else {
              startListening(handleTranscript);
            }
          }}
          className={`
            mt-8
            w-28 h-28 rounded-full
            flex items-center justify-center
            transition-all duration-300
            shadow-2xl
            ${
              listening
                ? "bg-red-500 scale-110 animate-pulse"
                : "bg-blue-600 hover:scale-105"
            }
          `}
        >
          <Mic
            size={44}
            className="text-white"
          />
        </button>

        <p className="mt-5 text-sm text-slate-600">
          Supports English, हिंदी, मराठी
        </p>
      </div>
    </div>
  );
}