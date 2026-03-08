import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles/tailwind.css";
import DashboardApp from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Dashboard root not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>,
);
