import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import CombineWrapper from "./components/wrapper/CombineWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CombineWrapper />
  </StrictMode>
);
