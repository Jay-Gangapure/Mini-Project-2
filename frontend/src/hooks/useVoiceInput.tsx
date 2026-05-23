import { useState, useRef } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function useVoiceInput(lang: string) {
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  // -----------------------------------
  // LANGUAGE DETECTION
  // -----------------------------------

  const getRecognitionLanguage = () => {
    switch (lang) {
      case "hi":
        return "hi-IN";

      // Marathi works better using Hindi engine
      // because browser Marathi recognition
      // is unstable in Chrome

      case "mr":
        return "mr-IN";

      default:
        return "en-US";
    }
  };

  // -----------------------------------
  // START LISTENING
  // -----------------------------------

  const startListening = (
    onResult: (text: string) => void,
  ) => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          "Speech Recognition is not supported in this browser. Use Google Chrome."
        );
        return;
      }

      // STOP OLD SESSION
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition =
        new SpeechRecognition();

      recognitionRef.current =
        recognition;

      recognition.lang =
        getRecognitionLanguage();

      recognition.continuous = true;

      recognition.interimResults = true;

      recognition.maxAlternatives = 1;

      let finalTranscript = "";

      // -----------------------------
      // START
      // -----------------------------

      recognition.onstart = () => {
        console.log(
          "🎤 Voice Listening Started:",
          recognition.lang
        );

        setListening(true);
      };

      // -----------------------------
      // RESULT
      // -----------------------------

      recognition.onresult = (
        event: any
      ) => {
        let interimTranscript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const transcript =
            event.results[i][0].transcript;

          // FINAL RESULT
          if (event.results[i].isFinal) {
            finalTranscript +=
              transcript + " ";
          } else {
            // LIVE SPEECH
            interimTranscript +=
              transcript + " ";
          }
        }

        console.log(
          "📝 LIVE:",
          finalTranscript +
          interimTranscript
        );

        // CALL LIVE TEXT CALLBACK
        

        // RESET SILENCE TIMER
        if (silenceTimerRef.current) {
          clearTimeout(
            silenceTimerRef.current
          );
        }

        // WAIT 5 SECONDS AFTER USER STOPS TALKING
        silenceTimerRef.current =
          setTimeout(() => {
            const finalText =
              (
                finalTranscript +
                interimTranscript
              ).trim();

            console.log(
              "✅ FINAL QUERY:",
              finalText
            );

            recognition.stop();

            if (finalText) {
              onResult(finalText);
            }

            finalTranscript = "";
          }, 3000);
      };


      // -----------------------------
      // ERROR
      // -----------------------------

      recognition.onerror = (
        event: any
      ) => {
        console.error(
          "❌ Voice Error:",
          event.error
        );

        setListening(false);

        if (
          event.error !== "no-speech" &&
          event.error !== "aborted"
        ) {
          alert(
            "Voice recognition failed. Please try again."
          );
        }
      };

      // -----------------------------
      // END
      // -----------------------------

      recognition.onend = () => {
        console.log(
          "🛑 Voice Recognition Ended"
        );

        setListening(false);

        if (silenceTimerRef.current) {
          clearTimeout(
            silenceTimerRef.current
          );
        }
      };

      recognition.start();
    } catch (error) {
      console.error(
        "VOICE START ERROR:",
        error
      );

      setListening(false);
    }
  };

  // -----------------------------------
  // STOP LISTENING
  // -----------------------------------

  const stopListening = () => {
    try {
      if (silenceTimerRef.current) {
        clearTimeout(
          silenceTimerRef.current
        );
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setListening(false);

      console.log(
        "🛑 Voice Listening Stopped"
      );
    } catch (error) {
      console.error(
        "STOP ERROR:",
        error
      );
    }
  };

  return {
    listening,
    startListening,
    stopListening,
  };
}