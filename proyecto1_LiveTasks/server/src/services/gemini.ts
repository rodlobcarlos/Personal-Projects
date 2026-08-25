import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

const genAI = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : null;

export function isGeminiAvailable(): boolean {
  return genAI !== null;
}

function getModel() {
  if (!genAI) throw new Error('GEMINI_API_KEY not configured');
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

export async function parseNaturalTask(input: string): Promise<{
  title: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
}> {
  const model = getModel();

  const prompt = `You are a task parsing assistant. Given a natural language task description, extract:
- title: a clear, concise task title
- priority: "low", "medium", or "high"
- due_date: ISO 8601 date string (YYYY-MM-DD) or null if no date mentioned. Today is ${new Date().toISOString().split('T')[0]}.

Respond ONLY with valid JSON, no markdown fences. Example:
{"title":"Buy groceries","priority":"medium","due_date":"2025-01-15"}

User input: "${input}"`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as { title: string; priority: 'low' | 'medium' | 'high'; due_date: string | null };
}

export async function prioritizeTasks(tasks: Array<{ id: number; title: string; status: string; priority: string }>): Promise<Array<{ id: number; priority: 'low' | 'medium' | 'high' }>> {
  const model = getModel();

  const taskList = tasks.map((t) => `- [${t.status}/${t.priority}] ${t.title} (id:${t.id})`).join('\n');

  const prompt = `You are a productivity assistant. Review these tasks and suggest optimal priorities.
Consider: urgency, impact, effort, and dependencies.

Tasks:
${taskList}

Respond ONLY with valid JSON array of {id, priority}. Priority must be "low", "medium", or "high".
Example: [{"id":1,"priority":"high"},{"id":2,"priority":"low"}]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as Array<{ id: number; priority: 'low' | 'medium' | 'high' }>;
}

export async function chatWithAI(
  userMessage: string,
  tasks: Array<{ title: string; status: string; priority: string }>,
): Promise<string> {
  const model = getModel();

  const taskContext = tasks.length > 0
    ? `The user has these tasks:\n${tasks.map((t) => `- [${t.status}/${t.priority}] ${t.title}`).join('\n')}`
    : 'The user has no tasks yet.';

  const prompt = `You are a friendly productivity assistant for the app Life&Tasks. Help the user plan their day, prioritize tasks, and stay organized. Be concise and helpful.

${taskContext}

User: ${userMessage}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateDailySummary(
  tasks: Array<{ title: string; status: string; priority: string; due_date: string | null }>,
  date: string,
): Promise<string> {
  const model = getModel();

  const taskList = tasks.length > 0
    ? tasks.map((t) => `- [${t.status}/${t.priority}] ${t.title}${t.due_date ? ` (due: ${t.due_date})` : ''}`).join('\n')
    : 'No tasks for this day.';

  const prompt = `You are a productivity assistant. Generate a brief daily summary for ${date}.

Tasks:
${taskList}

Write a concise 2-3 sentence summary in the same language as the tasks. Highlight what's done, what's pending, and give one actionable suggestion.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
