export function detectPlatform(hostname) {
  if (hostname.includes("whatsapp")) return "WhatsApp";
  if (hostname.includes("instagram")) return "Instagram";
  if (hostname.includes("facebook")) return "Facebook";
  if (hostname.includes("tiktok")) return "TikTok";
  if (hostname.includes("twitter") || hostname.includes("x.com"))
    return "Twitter/X";
  if (hostname.includes("threads")) return "Threads";
  if (hostname.includes("discord")) return "Discord";
  if (hostname.includes("telegram")) return "Telegram";
  return "Desconocida";
}
