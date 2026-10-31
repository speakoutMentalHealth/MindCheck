import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
// No tools, browsing, user prompts, conversation history or telemetry.
export async function explain(env, fact, language, signal) {
  const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
  const { text } = await generateText({
    model: google(env.GEMINI_MODEL),
    instructions: 'Explain only the supplied MindCheck platform fact in two short sentences. Do not add facts, links, instructions for treatment, medical advice, diagnoses, scoring, promises of service or certificate eligibility. Do not mention any person. If a screening disclaimer is needed, use only the exact standalone sentence "Screening results are not a diagnosis." in English or "Un résultat n’est pas un diagnostic." in French. Do not paraphrase that disclaimer or use diagnosis-related words elsewhere. Plain text only. If the fact is insufficient, repeat it. Language: '+(language==='fr'?'French':'English')+'.',
    prompt: fact,
    maxOutputTokens: 240,
    maxRetries: 0,
    abortSignal: signal,
    experimental_telemetry: { isEnabled: false }
  });
  return text;
}
