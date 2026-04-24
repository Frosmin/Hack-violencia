import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/tailwind.css";
import EvidencesApp from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Evidences root not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <EvidencesApp />
  </React.StrictMode>,
);
