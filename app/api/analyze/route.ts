import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert technical recruiter and resume coach.
Analyze the resume text the user provides and respond with ONLY valid JSON in exactly this shape:
{
  "overallScore": number between 0 and 100,
  "summary": "2 sentence overview",
  "strengths": ["3 to 5 items"],
  "weaknesses": ["3 to 5 items"],
  "bulletRewrites": [{ "original": "...", "improved": "..." }],
  "missingSections": ["sections a strong resume should have but this lacks"],
  "atsTips": ["3 to 5 items"]
}
Be specific and honest. Base everything on the resume text and do not invent details.
Give 2 to 4 bulletRewrites, quoting real bullets from the resume.`;

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return Response.json({ error: "No resume text provided" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text.slice(0, 15000) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    return Response.json({ analysis: JSON.parse(content) });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}