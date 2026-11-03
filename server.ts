import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Shared Gemini client setup using @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const JIN_WOO_SYSTEM_INSTRUCTION = `
You are the AI companion and personal trainer of the SHADOW SYSTEM app, inspired by the calm, direct, disciplined, and strategic persona of Sung Jin-Woo.

PERSONALITY RULES:
1. Speak in simple Hinglish (blend of English and conversational Hindi).
2. Use short, direct, confident, and calm sentences.
3. Keep answers focused on the main point. Avoid long fluff or overly decorative motivational speeches.
4. Treat the user as a familiar, trusted hunter/student who wants real improvement.
5. Correct weaknesses and mistakes directly. Be serious when they slip up, but never insult, humiliate, or give fake praise.
6. Give practical, actionable advice for everyday student life, routine, focus, physical fitness, and mental discipline.
7. Do not claim to literally be the fictional anime character in a fantasy world. You are the digital SHADOW SYSTEM AI.
8. Ground your answers in the user's REAL application data provided in the prompt context (routine completion, daily quests, diary logs, hunter progress index). Never invent fake scores or completed tasks.
`;

// Local Jin-Woo Smart Response Helper for offline/unbilled fallback
function getJinWooSmartResponse(prompt: string, contextState: any): string {
  const p = prompt.toLowerCase();
  const { userProfile, dailyProgress, currentQuest, diary } = contextState || {};

  const completed = dailyProgress?.completedCount || 0;
  const total = dailyProgress?.routineTasks?.length || 19;
  const routinePct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const indexPct = userProfile?.currentHunterIndex ? (userProfile.currentHunterIndex * 100).toFixed(4) : '0.0001';
  const questTitle = currentQuest?.title || 'Daily Quest Mission';

  if (p.includes('routine') || p.includes('complete') || p.includes('schedule')) {
    return `Abhi tumhara routine ${completed} / ${total} tasks complete hua hai (${routinePct}%). Baki pending tasks target timings par finish karo.`;
  }

  if (p.includes('percent') || p.includes('%') || p.includes('jin-woo') || p.includes('progress') || p.includes('index')) {
    return `Tumhara Current Hunter Progress Index abhi ${indexPct}% hai. Direct action aur consistent routine adherence se hi index gradually badhega.`;
  }

  if (p.includes('quest') || p.includes('mission') || p.includes('next')) {
    return `Aaj ka mission: "${questTitle}". Mission steps follow karke reflection submit karo.`;
  }

  if (p.includes('weakness') || p.includes('mistake') || p.includes('galti')) {
    return `Sabse badi weakness timing par action na lena hai. Reason search mat karo, agle study block par focus karo.`;
  }

  if (p.includes('hi') || p.includes('hello') || p.includes('hey') || p.includes('kaise')) {
    return `System Online. Tabiyat aur status check clear hai. Focus loss hone mat do, agla task shuru karo.`;
  }

  return `System Log Received. Progress: ${routinePct}% routine complete, Index: ${indexPct}%. Action orientation maintain rakho.`;
}

// Helper to retrieve custom user AI client or shared default
function getAiClient(req?: express.Request): GoogleGenAI {
  if (req) {
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.customApiKey;
    if (customKey && customKey.trim().length > 10) {
      return new GoogleGenAI({
        apiKey: customKey.trim(),
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    }
  }
  return ai;
}

// Helper to generate content or chat with fallback models
async function callGeminiChatWithFallback(prompt: string, systemInstruction: string, client: GoogleGenAI = ai) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  for (const modelName of modelsToTry) {
    try {
      const chat = client.chats.create({
        model: modelName,
        config: { systemInstruction },
      });
      const response = await chat.sendMessage({ message: prompt });
      if (response.text) return response.text;
    } catch (err: any) {
      // Try next model silently
    }
  }
  return null;
}

async function callGeminiGenerateWithFallback(promptText: string, systemInstruction: string, client: GoogleGenAI = ai, jsonMode = false) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  for (const modelName of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: promptText,
        config: {
          systemInstruction,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {})
        },
      });
      if (response.text) return response.text;
    } catch (err: any) {
      // Try next model silently
    }
  }
  return null;
}

// API Routes

// 1. System Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { prompt, history = [], contextState = {} } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const { userProfile, dailyProgress, currentQuest, diary } = contextState;
  const client = getAiClient(req);

  const contextSummary = `
[CURRENT SYSTEM DATA CONTEXT]
User: ${userProfile?.displayName || 'Hunter'}
Current Day: ${userProfile?.currentDay || 1} / 30
Current Hunter Progress Index: ${userProfile?.currentHunterIndex ? (userProfile.currentHunterIndex * 100).toFixed(4) + '%' : '0.0001%'}
Streak: ${userProfile?.streak || 1} days
Today Routine Profile: ${dailyProgress?.routineProfile || 'normal'}
Routine Completion: ${dailyProgress?.completedCount || 0} / ${dailyProgress?.routineTasks?.length || 19} tasks (${dailyProgress?.routineScore || 0}%)
Today Quest: ${currentQuest?.title || 'None'} (Status: ${currentQuest?.status || 'pending'})
Recent Diary Logged: ${diary?.content ? 'Yes' : 'No'}
`;

  const responseText = await callGeminiChatWithFallback(prompt, JIN_WOO_SYSTEM_INSTRUCTION + '\n' + contextSummary, client);

  if (responseText) {
    return res.json({ response: responseText });
  }

  // Smart Jin-Woo fallback response grounded in user's real state
  const fallbackResponse = getJinWooSmartResponse(prompt, contextState);
  res.json({ response: fallbackResponse });
});

// 2. Diary Analysis Endpoint
app.post('/api/diary-analysis', async (req, res) => {
  const { diaryContent, accomplishments, mistakes, learnings, emotionNotes, dayNumber } = req.body;
  const client = getAiClient(req);

  try {
    const promptText = `
Analyze this Day ${dayNumber} diary entry:
- Main Log: ${diaryContent}
- Accomplishments: ${accomplishments}
- Mistakes: ${mistakes}
- Learnings: ${learnings}
- Emotion Notes: ${emotionNotes}

Evaluate 8 parameters: Discipline, Decision-making, Emotional control, Confidence, Problem-solving, Self-awareness, Consistency, Behaviour.

Return a valid JSON object with EXACTLY this structure:
{
  "evaluation": "Short Hinglish summary of the day",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "mistakes": ["Mistake 1"],
  "advice": "Practical advice for tomorrow in Hinglish",
  "tomorrowObjective": "Clear objective for tomorrow",
  "scoreImpact": 0.0002
}
`;

    const rawText = await callGeminiGenerateWithFallback(promptText, JIN_WOO_SYSTEM_INSTRUCTION + '\nRespond in strict valid JSON format only.', client, true);
    if (rawText) {
      const parsed = JSON.parse(rawText.trim());
      return res.json(parsed);
    }
    throw new Error('No AI response');
  } catch (err: any) {
    console.warn('Gemini Diary Analysis fallback triggered:', err?.message || err);
    res.json({
      evaluation: `Day ${dayNumber} log saved. Self-awareness dikhai de rahi hai. Routine focus maintain rakho.`,
      strengths: [accomplishments ? 'Task Accomplishment' : 'Journal Consistency'],
      weaknesses: [mistakes ? 'Identified Mistakes' : 'Impulse Distractions'],
      mistakes: mistakes ? [mistakes] : ['Scheduled timing delays'],
      advice: 'Kal ke agle target par concentrate karo. Routine timing strictly follow karo.',
      tomorrowObjective: 'Maintain 100% schedule initiation.',
      scoreImpact: 0.0002
    });
  }
});

// 3. Quest Evaluation Endpoint
app.post('/api/quest-eval', async (req, res) => {
  const { questTitle, category, reflectionAnswer, dayNumber } = req.body;
  const client = getAiClient(req);

  try {
    const promptText = `
Day ${dayNumber} Mission: "${questTitle}" (${category})
User Reflection Answer: "${reflectionAnswer}"

Evaluate the answer. Give short, direct Hinglish feedback on whether the reflection shows genuine effort or needs more depth. Keep it under 3 short sentences.
`;

    const responseText = await callGeminiGenerateWithFallback(promptText, JIN_WOO_SYSTEM_INSTRUCTION, client);
    res.json({ evaluation: responseText || 'Mission completed. Good effort.' });
  } catch (err: any) {
    console.warn('Gemini Quest Eval fallback triggered:', err?.message || err);
    res.json({ evaluation: `Day ${dayNumber} Mission cleared. Reflection log recorded in System.` });
  }
});

// 4. Emotion Control Analysis Endpoint
app.post('/api/emotion-analysis', async (req, res) => {
  const { feeling, trigger, reaction, betterResponse } = req.body;
  const client = getAiClient(req);

  try {
    const promptText = `
Emotional Log:
- Feeling: ${feeling}
- Trigger: ${trigger}
- Reaction: ${reaction}
- Planned Better Response: ${betterResponse}

Provide a short Jin-Woo Hinglish response analyzing the trigger and giving a 1-line mental control directive. Keep it direct and practical.
`;

    const responseText = await callGeminiGenerateWithFallback(promptText, JIN_WOO_SYSTEM_INSTRUCTION, client);
    res.json({ feedback: responseText || 'Trigger noted. Focus on controlling the 5-second pause next time.' });
  } catch (err: any) {
    res.json({ feedback: 'Trigger recorded. Next time reaction dene se pehle 5 seconds pause karo.' });
  }
});

// 5. Weekly Report Endpoint
app.post('/api/weekly-report', async (req, res) => {
  const client = getAiClient(req);
  try {
    const { weekNumber, completedQuests, routineConsistency, averageScore } = req.body;

    const promptText = `
Generate a Week ${weekNumber} Review Report:
- Completed Quests: ${completedQuests} / 7
- Routine Consistency: ${routineConsistency}%
- Average Attribute Score: ${averageScore}

Return a valid JSON object:
{
  "summary": "Concise Hinglish evaluation of the week",
  "strongestAttribute": "Mental Strength / Discipline / Focus",
  "weakestAttribute": "Emotional Control / Observation",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;

    const rawText = await callGeminiGenerateWithFallback(promptText, JIN_WOO_SYSTEM_INSTRUCTION, client, true);
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    }
    throw new Error('No response');
  } catch (err: any) {
    res.json({
      summary: `Week ${req.body.weekNumber} completed. Consistency good hai.`,
      strongestAttribute: 'Discipline',
      weakestAttribute: 'Focus',
      recommendations: ['Daily schedule maintain rakho', 'Weak topics active recall karo']
    });
  }
});

// 6. Final 30-Day Report Endpoint
app.post('/api/final-report', async (req, res) => {
  const client = getAiClient(req);
  try {
    const { daysCompleted, totalQuests, startingIndex, finalIndex } = req.body;

    const promptText = `
Generate a Final 30-Day Transformation Report:
- Days Completed: ${daysCompleted}
- Total Quests Solved: ${totalQuests}
- Starting Hunter Index: ${(startingIndex * 100).toFixed(4)}%
- Final Hunter Index: ${(finalIndex * 100).toFixed(4)}%

Return a valid JSON object:
{
  "summary": "Detailed, calm, inspiring Hinglish final evaluation of the 30-day journey",
  "mentalImprovement": "Noticeable increase in focus and self-control",
  "physicalImprovement": "Consistent daily physical effort logged",
  "disciplineGain": "Established solid daily routine habit",
  "topStrengths": ["Consistency", "Focus under pressure"],
  "remainingWeaknesses": ["Impulsive phone checks"],
  "next30DayStrategy": "Maintain current routine and increase study block intensity."
}
`;

    const rawText = await callGeminiGenerateWithFallback(promptText, JIN_WOO_SYSTEM_INSTRUCTION, client, true);
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    }
    throw new Error('No response');
  } catch (err: any) {
    res.json({
      summary: '30-Day Crucible completed. System attributes successfully updated.',
      mentalImprovement: 'Strong mental endurance developed.',
      physicalImprovement: 'Physical routine baseline achieved.',
      disciplineGain: 'Consistent execution established.',
      topStrengths: ['Discipline', 'Daily routine adherence'],
      remainingWeaknesses: ['Focus during late hours'],
      next30DayStrategy: 'Continue daily protocol with elevated targets.'
    });
  }
});

// Serve Vite frontend in development or static dist in production
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) return;
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SHADOW SYSTEM] Server running on http://0.0.0.0:${PORT}`);
});
