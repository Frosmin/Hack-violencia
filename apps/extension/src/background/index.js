import { ensureBootstrapData } from "@/shared/storage";
import { registerMessageBus } from "./message-bus";

chrome.runtime.onInstalled.addListener(() => {
  void ensureBootstrapData();
  console.log("[EscudoDigital] Extension instalada correctamente.");
});

chrome.runtime.onStartup.addListener(() => {
  void ensureBootstrapData();
});

registerMessageBus();
