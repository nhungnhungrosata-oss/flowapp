export type TextAiProvider = "gemini" | "deepseek";

export type GenerateTextInput = {
  provider: TextAiProvider;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
};

const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions";

export async function generateText(input: GenerateTextInput): Promise<string> {
  return input.provider === "gemini"
    ? generateWithGemini(input)
    : generateWithDeepSeek(input);
}

export async function generateJson<T = unknown>(input: Omit<GenerateTextInput, "jsonMode">): Promise<T> {
  const raw = await generateText({ ...input, jsonMode: true });
  return parseJsonResponse<T>(raw);
}

async function generateWithGemini(input: GenerateTextInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY chưa được cấu hình trên Vercel.");

  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: input.systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: input.userPrompt }] }],
        generationConfig: {
          temperature: input.temperature ?? 0.7,
          maxOutputTokens: input.maxTokens ?? 4096,
          ...(input.jsonMode ? { responseMimeType: "application/json" } : {}),
        },
      }),
      cache: "no-store",
    },
  );

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini API lỗi ${response.status}.`);
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini không trả về nội dung.");
  return text;
}

async function generateWithDeepSeek(input: GenerateTextInput): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY chưa được cấu hình trên Vercel.");

  const response = await fetch(DEEPSEEK_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: "system", content: input.systemPrompt },
        { role: "user", content: input.userPrompt },
      ],
      temperature: input.temperature ?? 0.7,
      max_tokens: input.maxTokens ?? 4096,
      stream: false,
      ...(input.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
    cache: "no-store",
  });

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(data.error?.message || `DeepSeek API lỗi ${response.status}.`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("DeepSeek không trả về nội dung.");
  return text;
}

export function parseJsonResponse<T = unknown>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1)) as T;
    }
    throw new Error("AI trả về JSON không hợp lệ. Vui lòng thử lại.");
  }
}
