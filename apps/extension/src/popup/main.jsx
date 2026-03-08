import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/tailwind.css";
import PopupApp from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Popup root not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);
