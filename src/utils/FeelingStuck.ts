export const Prompts = [
  "How are things going with your life? Any milestones lately?",
  "What was the best part of your day today?",
  "Have you watched any interesting movies or TV shows lately?",
];

export function getRandomPromptIx(): number {
  return Math.floor(Math.random() * Prompts.length);
}
