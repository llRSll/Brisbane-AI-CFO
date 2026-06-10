import "server-only";

import { openai } from "@ai-sdk/openai";

export const OPENAI_MODEL = "gpt-4o-mini";

/** Ready-to-use OpenAI model via the Vercel AI SDK. */
export const getOpenAIModel = () => openai(OPENAI_MODEL);

export const isOpenAIConfigured = (): boolean =>
  Boolean(process.env.OPENAI_API_KEY);

export const verifyOpenAI = (): { ok: boolean; error?: string } => {
  if (!isOpenAIConfigured()) {
    return { ok: false, error: "OPENAI_API_KEY is not set" };
  }
  return { ok: true };
};
