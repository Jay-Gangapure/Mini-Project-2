export const speakText = (
  text: string,
  lang: "en" | "hi" | "mr"
) => {

  if (!window.speechSynthesis) {
    alert("Speech synthesis not supported");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Language mapping
  if (lang === "hi") {
    utterance.lang = "hi-IN";
  } else if (lang === "mr") {
    utterance.lang = "mr-IN";
  } else {
    utterance.lang = "en-US";
  }

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};