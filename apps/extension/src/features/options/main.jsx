import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/tailwind.css";
import OptionsApp from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Options root not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>,
);
