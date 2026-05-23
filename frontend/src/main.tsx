
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/index.css";
window.speechSynthesis.onvoiceschanged =
  () => {

    window.speechSynthesis.getVoices();

  };
  createRoot(document.getElementById("root")!).render(<App />);
  

