const MESSAGE_SELECTORS = {
  WhatsApp: [
    ".message-in .copyable-text span[dir]",
    ".message-out .copyable-text span[dir]",
    "._ao3e",
  ],
  Instagram: [
    "div[role='row'] div[dir='auto']",
    "._aacl._aaco._aacu._aacx._aad6._aade",
  ],
  Facebook: [
    "div[data-scope='messages_table'] div[dir='auto']",
    ".x1lliihq span",
  ],
  TikTok: [".tiktok-chat-container span", ".message-text"],
  "Twitter/X": [
    "[data-testid='tweetText']",
    "div[data-testid='DMConversationEntry'] span",
  ],
  Discord: [".markup-eYLPri", ".messageContent-2t3eCI"],
  Telegram: [".text-content", ".message"],
  Threads: ["div[dir='auto'] span"],
  Desconocida: ["[dir='auto']", "span", "p"],
};

export function getSelectorsForPlatform(platform) {
  return (MESSAGE_SELECTORS[platform] || MESSAGE_SELECTORS.Desconocida).join(
    ", ",
  );
}
