export interface FableModule {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  explanation: string;
  fableGuideline: string;
  anthropicContext: string;
  beforePrompt: string;
  afterPrompt: string;
  behaviorBenefit: string;
}

export interface PresetExample {
  id: string;
  title: string;
  category: string;
  prompt: string;
  context: string;
  reason: string;
  description: string;
  expectedDifference: string;
  difficulty: "routine" | "complex";
}

export interface EvaluationResult {
  text: string;
  wordCount: number;
}

export interface CompareResult {
  standard: EvaluationResult;
  fable: EvaluationResult;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  source: string;
}

export interface VerificationCheck {
  id: string;
  text: string;
  category: "prompt" | "model" | "harness";
  checked: boolean;
}

export interface BonusPhrase {
  id: string;
  title: string;
  description: string;
  templatePrompt: string;
  explanation: string;
  simulationResponse: string;
  productivityCategory: string;
}

