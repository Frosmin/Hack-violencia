import { DANGER_PATTERNS } from "@/content/detector/rules/danger-rules";

export function analyzeText(text) {
  if (!text || text.trim().length < 3) return null;

  for (const [patternKey, category] of Object.entries(DANGER_PATTERNS)) {
    for (const pattern of category.patterns) {
      if (pattern.test(text)) {
        return {
          category: category.label,
          riskLevel: category.level,
          emoji: category.emoji,
          patternKey,
        };
      }
    }
  }

  return null;
}
