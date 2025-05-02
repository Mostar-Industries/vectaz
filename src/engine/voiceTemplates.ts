type VoiceTemplate = {
  assertive: string;
  calm: string;
  joke: string;
};

export const templates: Record<string, VoiceTemplate> = {
  greeting: {
    assertive: "Hey there! Let's crunch some numbers!",
    calm: "Hello. Ready to analyze your logistics options.",
    joke: "Why did the shipment break up with the warehouse? It needed more space!"
  },
  ranking: {
    assertive: "Boom! {name} takes the lead with {score} points!",
    calm: "Our top choice is {name} with a score of {score}.",
    joke: "This carrier's so fast, it delivers packages before you order them!"
  }
};

export const getTemplate = (key: string, tone: 'assertive'|'calm'|'joke' = 'calm') => {
  return templates[key]?.[tone] || key;
};
