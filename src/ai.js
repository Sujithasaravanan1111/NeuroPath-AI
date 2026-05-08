// Direct API calls to OpenRouter
import { AI_API_KEY } from "./config/env";

const API_KEY = import.meta.env.VITE_AI_API_KEY|| ""; // should be provided via VITE_AI_API_KEY
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const IS_DEV = import.meta.env.DEV;

if (!API_KEY) {
  console.warn("AI_API_KEY is not set. AI requests will fail.");
}

export async function generateLearningPath(topic) {
  if (!API_KEY) {
    console.warn("Attempted to generate learning path without an API key.");
    if (IS_DEV) {
      // generic placeholder so the UI still shows something sensible
      return `Learning path placeholder for **${topic}**:

1. Start with the fundamentals of ${topic}.
2. Read articles, watch tutorials, and take online courses.
3. Build small projects to apply what you learn.
4. Review and iterate based on your progress.`;
    }
    return "Error: AI API key not configured. Please set VITE_AI_API_KEY in your environment.";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Act as an expert career mentor and create a COMPLETE MASTER ROADMAP for learning ${topic} from beginner to expert level.

Structure the roadmap as follows:

LEVEL 1: BEGINNER
- Concepts
- Explanation
- Practice exercises
- Tools to learn

LEVEL 2: INTERMEDIATE
- Advanced concepts
- Hands-on practice
- Industry tools

LEVEL 3: ADVANCED
- Deep concepts
- Real-world applications
- Optimization techniques

LEVEL 4: EXPERT
- Industry-level skills
- Architecture understanding
- Best practices

Also include:

PROJECTS SECTION:
- 5 real-world projects with explanation

CAREER SECTION:
- Job roles related to this skill
- Required skills

TIMELINE SECTION:
- Estimated timeline to master

Make the roadmap extremely detailed and structured.

Topic: ${topic}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data.error?.message || data.error || "Failed to generate learning path");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}. Please check the console for details.`;
  }
}

export async function generateQuiz(topic) {
  if (!API_KEY) {
    console.warn("Attempted to generate quiz without an API key.");
    if (IS_DEV) {
      return `**(mock)** Quiz on **${topic}**:
Q1: Placeholder question?
A1: Placeholder answer.`;
    }
    return "Error: AI API key not configured. Please set VITE_AI_API_KEY in your environment.";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate 5 challenging quiz questions with detailed answers about ${topic}. Format: Q1: [question]\nA1: [answer]\n\n`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data.error?.message || data.error || "Failed to generate quiz");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return `Error: ${error.message}. Please check the console for details.`;
  }
}

export async function chatWithAI(userMessage) {
  if (!API_KEY) {
    console.warn("Attempted to chat with AI without an API key.");
    if (IS_DEV) {
      return "**(mock)** I can't chat because the API key is missing. Set VITE_AI_API_KEY to see real responses.";
    }
    return "Error: AI API key not configured. Please set VITE_AI_API_KEY in your environment.";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI tutor for NeuroPath AI, an educational learning platform. Help users with learning strategies, answer questions about learning paths, quizzes, certificates, and the features of NeuroPath AI. Be encouraging and supportive.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(data.error?.message || data.error || "Failed to get AI response");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return `Error connecting to AI: ${error.message}`;
  }
}
