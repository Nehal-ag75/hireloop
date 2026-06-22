const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * DIRECT REVIEW MODE
 * Analyzes code and gives complexity, edge cases, and a verdict.
 */
async function getDirectReview(code, problemTitle) {
  const prompt = `You are an expert coding interviewer reviewing a candidate's solution.

Problem: "${problemTitle}"

Candidate's code:
\`\`\`
${code}
\`\`\`

Analyze this code and respond ONLY with valid JSON (no markdown, no backticks, no extra text) in exactly this format:
{
  "verdict": "Correct" or "Incorrect" or "Partially Correct",
  "timeComplexity": "e.g. O(n)",
  "spaceComplexity": "e.g. O(1)",
  "missedEdgeCases": ["list of edge cases not handled, empty array if none"],
  "suggestion": "one paragraph suggesting improvement or confirming it's optimal",
  "explanation": "2-3 sentences explaining the verdict in plain English"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJson(text);
}

/**
 * SOCRATIC MODE
 * Never reveals the answer — only asks guiding questions.
 */
async function getSocraticHint(code, problemTitle, hintLevel = 1) {
  const intensity = {
    1: 'Give a very gentle, high-level nudge. Do not mention any specific data structure or algorithm.',
    2: 'Give a moderate hint pointing toward the right approach category (e.g. "think about a data structure that allows fast lookups") without naming the exact technique.',
    3: 'Give a strong hint that is close to revealing the approach, but still phrase it as a question, not a direct answer.',
  };

  const prompt = `You are a Socratic coding mentor. You NEVER give direct answers or write correct code for the user. You only ask guiding questions that help them discover the solution themselves.

Problem: "${problemTitle}"

Candidate's current code attempt:
\`\`\`
${code}
\`\`\`

Hint intensity level ${hintLevel}: ${intensity[hintLevel] || intensity[1]}

Respond ONLY with valid JSON (no markdown, no backticks) in exactly this format:
{
  "hint": "your Socratic guiding question or nudge here",
  "encouragement": "one short encouraging sentence"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJson(text);
}

/**
 * Safely parses AI response text into JSON, handling cases where
 * the model wraps output in markdown code fences despite instructions.
 */
function parseAIJson(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI response as JSON:', cleaned);
    throw new Error('AI returned invalid JSON format');
  }
}
/**
 * MOCK INTERVIEW - Start or continue a conversation
 * Maintains context by passing the full conversation history each time.
 */
async function getInterviewerResponse(problemTitle, conversationHistory) {
  const systemContext = `You are a strict but fair technical interviewer at a top tech company conducting a coding interview.

Problem to interview on: "${problemTitle}"

Rules you MUST follow:
- Never accept vague answers. Always probe deeper (ask about complexity, edge cases, alternative approaches).
- Ask ONE question at a time.
- If the candidate gives a good answer, acknowledge briefly then ask a natural follow-up.
- If this is the start of the conversation (empty history), begin by presenting the problem clearly and asking them to explain their initial approach.
- Keep your responses concise, like a real interviewer would speak (2-4 sentences max).

Conversation so far:
${conversationHistory.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n')}

Respond ONLY with valid JSON (no markdown, no backticks) in exactly this format:
{
  "interviewerMessage": "your next message as the interviewer"
}`;

  const result = await model.generateContent(systemContext);
  const text = result.response.text();
  return parseAIJson(text);
}

/**
 * MOCK INTERVIEW - Generate final scorecard after interview ends
 */
async function generateScorecard(problemTitle, conversationHistory) {
  const prompt = `You are evaluating a completed technical interview.

Problem: "${problemTitle}"

Full conversation:
${conversationHistory.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n')}

Based on this conversation, evaluate the candidate. Respond ONLY with valid JSON (no markdown, no backticks) in exactly this format:
{
  "problemSolving": <score 0-10>,
  "communication": <score 0-10>,
  "complexityAwareness": <score 0-10>,
  "edgeCaseHandling": <score 0-10>,
  "overallVerdict": "Strong Hire" or "Hire" or "Lean Hire" or "No Hire",
  "summary": "2-3 sentence summary of performance"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJson(text);
}
/**
 * RESUME ANALYZER
 * Compares resume text against a target job description, gives gap analysis
 */
async function analyzeResume(resumeText, jobDescription, targetRole) {
  const prompt = `You are an expert technical recruiter and resume coach.

Resume content:
${resumeText}

${jobDescription ? `Target job description:\n${jobDescription}` : `Target role: ${targetRole || 'Software Engineer Intern'}`}

Analyze this resume and respond ONLY with valid JSON (no markdown, no backticks) in exactly this format:
{
  "matchScore": <number 0-100>,
  "strengths": ["list of 2-4 genuine strengths in the resume"],
  "missingKeywords": ["list of important keywords/skills missing for this role"],
  "weakBullets": [
    {
      "original": "a weak bullet point quoted or closely paraphrased from the resume",
      "improved": "a rewritten, stronger, impact-focused version of that bullet",
      "reason": "why the original was weak (e.g. task-focused not impact-focused)"
    }
  ],
  "overallFeedback": "2-3 sentence summary of how to improve this resume for the target role"
}

Limit weakBullets to the 2-3 weakest points in the resume.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJson(text);
}

module.exports = { getDirectReview, getSocraticHint, getInterviewerResponse, generateScorecard, analyzeResume };