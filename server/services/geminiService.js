import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export const processCommits = async (commits) => {
  try {
    const commitText = commits.map(c => `- ${c.message}`).join('\n')

    const prompt = `You are a changelog categorizer. For each commit message below, categorize it as FIX, FEATURE, UPDATED, ADDED, DELETED, or PATCHED, and provide a clean one-line summary. Return ONLY valid JSON with no markdown backticks or preamble.

Commits:
${commitText}

Return exactly this JSON structure (no extra text):
{
  "categorized": [
    { "hash": "abc123", "message": "original message", "category": "FIX", "summary": "clean one-liner" },
    ...
  ]
}`

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    )

    const responseText = res.data.candidates[0].content.parts[0].text
    const cleaned = responseText.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return parsed.categorized
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message)
    throw err
  }
}




