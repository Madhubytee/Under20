const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function detectIngredientsFromImage(base64Image: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
            {
              type: 'text',
              text: 'List all the food ingredients you can see in this image. Return ONLY a JSON array of ingredient name strings, lowercase, no quantities. Example: ["eggs", "milk", "butter"]. Nothing else.',
            },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) throw new Error('OpenAI request failed');

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '[]';

  const match = content.match(/\[.*\]/s);
  if (!match) return [];

  return JSON.parse(match[0]) as string[];
}
