let synth = window.speechSynthesis;

let currentUtterance:
  SpeechSynthesisUtterance | null = null;

// ======================================
// GET BEST VOICE
// ======================================

const getVoiceByLanguage = (
  lang: string
) => {

  const voices = synth.getVoices();

  // DEBUG
  console.log(
    "AVAILABLE VOICES:",
    voices
  );

  // -----------------------------
  // HINDI
  // -----------------------------

  if (lang === "hi") {

    return (
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .includes("hi")
      ) ||

      voices.find((voice) =>
        voice.name
          .toLowerCase()
          .includes("india")
      )
    );
  }

  // -----------------------------
  // MARATHI
  // -----------------------------

  if (lang === "mr") {

    return (

      // Marathi voice if available
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .includes("mr")
      ) ||

      // Hindi fallback
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .includes("hi")
      ) ||

      // Indian English fallback
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .includes("en-in")
      )
    );
  }

  // -----------------------------
  // ENGLISH
  // -----------------------------

  return (

    voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .includes("en-in")
    ) ||

    voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .includes("en")
    )
  );
};

// ======================================
// PLAY VOICE
// ======================================

export const playVoice = (
  text: string,
  lang: string,
  onStart?: () => void,
  onEnd?: () => void
) => {

  stopVoice();

  if (!text?.trim()) return;

  const utterance =
    new SpeechSynthesisUtterance(text);

  currentUtterance = utterance;

  // LANGUAGE

  if (lang === "hi") {
    utterance.lang = "hi-IN";
  } else if (lang === "mr") {
    utterance.lang = "mr-IN";
  } else {
    utterance.lang = "en-IN";
  }

  // SELECT BEST VOICE

  const selectedVoice =
    getVoiceByLanguage(lang);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // NATURAL SETTINGS

  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // EVENTS

  utterance.onstart = () => {

    console.log(
      "VOICE STARTED:",
      utterance.lang
    );

    if (onStart) onStart();
  };

  utterance.onend = () => {

    console.log("VOICE ENDED");

    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {

    console.error(
      "VOICE ERROR:",
      event
    );

    if (onEnd) onEnd();
  };

  synth.speak(utterance);
};

// ======================================
// STOP VOICE
// ======================================

export const stopVoice = () => {

  synth.cancel();

  currentUtterance = null;
};