import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/tailwind.css";
import EducationApp from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Education root not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <EducationApp />
  </React.StrictMode>,
);
