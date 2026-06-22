import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export const processCommits = async (commits) => {
  try {
    const commitText = commits.map(c => `- ${c.message}`).join('\n')

    const prompt = `Convert git commits into a user-facing changelog.

Rules:
- Ignore README/docs/.gitignore/CI/CD/config/dependency-only/package updates, initial commits, uploads, merges, comment typos, and non-user-facing changes.
- Hide internal details (file paths, APIs, DB structure, endpoints, security internals).
- Keep only user-visible features, fixes, improvements, content changes, removals, and polish.
- Categories: FEATURE, FIX, UPDATED, ADDED, PATCHED, DELETED.
- Rewrite each commit as a short Play Store-style update note.
- Sort: FEATURE > FIX > UPDATED > ADDED > PATCHED > DELETED.

Commits:
${commitText}

Return only JSON:
{
  "categorized": [
    {
      "hash": "abc123",
      "message": "original commit",
      "category": "FEATURE",
      "summary": "user-friendly summary"
    }
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




