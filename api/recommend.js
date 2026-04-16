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
          content: `You are an AI Tool Advisor. A user has described their idea or project below. Recommend the best AI tools for them, explain the costs, and compare the top options clearly. Keep your response friendly and jargon-free.

User's idea: ${idea}`
        }
      ]
    })
  });

  const data = await response.json();
  const answer = data.content[0].text;
  res.status(200).json({ answer });
}
