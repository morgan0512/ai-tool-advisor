export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idea } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an AI Tool Advisor helping non-technical people find the right AI tools for their projects. 

When recommending tools always:
1. Recommend 3 tools maximum
2. For EVERY pricing tier explain exactly what "scales with X" means in plain English with a real example (e.g. "at 1,000 contacts it's $15/month, at 5,000 contacts it's $45/month")
3. Always explain the difference between SUBSCRIPTION pricing (flat monthly fee, predictable cost) vs TOKEN/API pricing (pay per use, costs vary based on how much you use it — like a phone bill vs a Netflix subscription)
4. For tools like ChatGPT, Claude, or Midjourney always clarify: is this the subscription version (e.g. ChatGPT Plus at $20/month) or the API version (pay per token/use)?
5. End every response with exactly 3 specific follow-up questions the user can click or type to go deeper
6. Keep all language friendly and jargon-free — define any technical term in parentheses the first time you use it

User's idea: ${idea}

IMPORTANT: You MUST end every response with this exact section, no exceptions:

---
**Want to go deeper? Ask me:**
1. [specific follow-up question based on their idea]
2. [specific follow-up question based on their idea]
3. [specific follow-up question based on their idea]`
        }
      ]
    })
  });

  const data = await response.json();
  const answer = data.content[0].text;
  res.status(200).json({ answer });
}
