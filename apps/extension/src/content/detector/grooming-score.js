import { GROOMING_ESCALATION } from "@/content/detector/rules/danger-rules";

export function updateGroomingScore(text, conversationId, history) {
  let added = 0;

  GROOMING_ESCALATION.forEach((rule) => {
    if (rule.pattern.test(text)) added += rule.score;
  });

  if (added === 0) {
    return {
      score: history[conversationId] || 0,
      nextHistory: history,
      added,
    };
  }

  const nextHistory = {
    ...history,
    [conversationId]: (history[conversationId] || 0) + added,
  };

  return {
    score: nextHistory[conversationId],
    nextHistory,
    added,
  };
}
