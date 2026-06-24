require('dotenv').config();

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const MODEL = '@cf/meta/llama-3.1-8b-instruct';

async function callCF(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }
      console.log('CF raw response:', JSON.stringify(data));
      const result = data.result;
      if (typeof result === 'string') return result;
      if (result?.response) return result.response;
      if (result?.choices?.[0]?.message?.content) return result.choices[0].message.content;
      if (result?.choices?.[0]?.text) return result.choices[0].text;
      return JSON.stringify(result);
    } catch (err) {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
}

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

  const text = await callCF(prompt);
  return parseAIJson(text);
}

async function getSocraticHint(code, problemTitle, hintLevel = 1) {
  const intensity = {
    1: 'Give a very gentle, high-level nudge. Do not mention any specific data structure or algorithm.',
    2: 'Give a moderate hint pointing toward the right approach category without naming the exact technique.',
    3: 'Give a strong hint that is close to revealing the approach, but still phrase it as a question.',
  };

  const prompt = `You are a Socratic coding mentor. You NEVER give direct answers or write correct code for the user.

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

  const text = await callCF(prompt);
  return parseAIJson(text);
}

async function getInterviewerResponse(problemTitle, conversationHistory) {
  const prompt = `You are a strict but fair technical interviewer at a top tech company conducting a coding interview.

Problem to interview on: "${problemTitle}"

Rules you MUST follow:
- Never accept vague answers. Always probe deeper.
- Ask ONE question at a time.
- If the candidate gives a good answer, acknowledge briefly then ask a follow-up.
- If conversation history is empty, begin by presenting the problem and asking for their initial approach.
- Keep responses concise (2-4 sentences max).

Conversation so far:
${conversationHistory.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n')}

Respond ONLY with valid JSON (no markdown, no backticks) in exactly this format:
{
  "interviewerMessage": "your next message as the interviewer"
}`;

  const text = await callCF(prompt);
  return parseAIJson(text);
}

async function generateScorecard(problemTitle, conversationHistory) {
  const prompt = `You are evaluating a completed technical interview.

Problem: "${problemTitle}"

Full conversation:
${conversationHistory.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n')}

Evaluate the candidate. Respond ONLY with valid JSON (no markdown, no backticks) in exactly this format:
{
  "problemSolving": <score 0-10>,
  "communication": <score 0-10>,
  "complexityAwareness": <score 0-10>,
  "edgeCaseHandling": <score 0-10>,
  "overallVerdict": "Strong Hire" or "Hire" or "Lean Hire" or "No Hire",
  "summary": "2-3 sentence summary of performance"
}`;

  const text = await callCF(prompt);
  return parseAIJson(text);
}

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
      "original": "a weak bullet point from the resume",
      "improved": "a rewritten, stronger, impact-focused version",
      "reason": "why the original was weak"
    }
  ],
  "overallFeedback": "2-3 sentence summary of how to improve this resume for the target role"
}

Limit weakBullets to the 2-3 weakest points in the resume.`;

  const text = await callCF(prompt);
  return parseAIJson(text);
}

module.exports = { getDirectReview, getSocraticHint, getInterviewerResponse, generateScorecard, analyzeResume };