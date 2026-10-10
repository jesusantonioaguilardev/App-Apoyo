import "server-only";
import OpenAI from "openai";

export const openai = new OpenAI(); // usa OPENAI_API_KEY

export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-5.4-mini";
export const CHAT_REASONING_EFFORT = (process.env.OPENAI_REASONING_EFFORT || "low") as "none" | "low" | "medium";
export const MAX_OUTPUT_TOKENS = 800;
export const MAX_USER_MESSAGE_CHARS = 2000;
export const HISTORY_MESSAGES = 20;
