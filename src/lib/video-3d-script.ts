import { z } from "zod";

export const video3DSceneSchema = z.object({
  id: z.string().min(1).max(40),
  title: z.string().min(2).max(120),
  narration: z.string().min(4).max(500),
  visualPrompt: z.string().min(20).max(1800),
  camera: z.string().min(2).max(300),
  onScreenText: z.string().max(120).default(""),
});

export const video3DScriptSchema = z.object({
  title: z.string().min(2).max(160),
  concept: z.string().min(4).max(500),
  scenes: z.array(video3DSceneSchema).min(1).max(5),
});

export type Video3DScript = z.infer<typeof video3DScriptSchema>;
export type ScriptProvider = "gemini" | "deepseek";

export type GenerateVideo3DScriptInput = {
  topic: string;
  sceneCount: number;
  style: string;
  provider: ScriptProvider;
};

export async function generateVideo3DScript(input: GenerateVideo3DScriptInput): Promise<Video3DScript> {
  const prompt = buildPrompt(input);
  const raw = input.provider === "gemini" ? await callGemini(prompt) : await callDeepSeek(prompt);
  const script = video3DScriptSchema.parse(parseJson(raw));
  if (script.scenes.length !== input.sceneCount) throw new Error(`AI trả về ${script.scenes.length} cảnh thay vì ${input.sceneCount} cảnh.`);
  return script;
}

function buildPrompt(input: GenerateVideo3DScriptInput) {
  const duration = input.sceneCount * 8;
  return `Bạn là biên kịch và đạo diễn video hoạt hình 3D ngắn cho mạng xã hội.

Hãy viết kịch bản bằng tiếng Việt cho chủ đề: "${input.topic}".
Phong cách nội dung: ${input.style}.
Số cảnh bắt buộc: ${input.sceneCount}.
Mỗi cảnh đúng 8 giây, tổng thời lượng khoảng ${duration} giây.

Yêu cầu sáng tạo:
- Dùng một nhân vật 3D nhân hóa xuyên suốt, ngoại hình và trang phục nhất quán giữa các cảnh.
- Mỗi cảnh có hành động rõ, dễ hiểu trong 8 giây và chuyển tiếp hợp lý.
- visualPrompt phải viết bằng tiếng Anh, tối ưu cho text-to-video: mô tả nhân vật, bối cảnh, ánh sáng, chất liệu 3D, hành động, camera, không chữ trong hình.
- Phong cách hình ảnh: premium stylized 3D animation, expressive character, cinematic lighting, polished materials, smooth motion, family-friendly.
- Không dùng tên thương hiệu có bản quyền hoặc nhân vật nổi tiếng.
- narration ngắn gọn để đọc vừa trong 8 giây.
- camera mô tả chuyển động máy quay riêng.
- onScreenText tối đa 8 từ.

Chỉ trả về JSON hợp lệ, không markdown, đúng cấu trúc:
{
  "title": "Tiêu đề video",
  "concept": "Mô tả ý tưởng tổng thể",
  "scenes": [
    {
      "id": "scene-1",
      "title": "Tên cảnh",
      "narration": "Lời dẫn tiếng Việt",
      "visualPrompt": "English video generation prompt",
      "camera": "Camera movement in English",
      "onScreenText": "Chữ ngắn trên màn hình"
    }
  ]
}`;
}

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  if (!apiKey) throw new Error("GEMINI_API_KEY chưa được cấu hình trên Vercel.");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: "You return production-ready JSON scripts for short 3D animated videos. Never wrap JSON in markdown." }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: 4096 },
    }),
    cache: "no-store",
  });

  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
  if (!response.ok) throw new Error(data.error?.message || `Gemini API lỗi ${response.status}.`);
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini không trả về nội dung kịch bản.");
  return text;
}

async function callDeepSeek(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY chưa được cấu hình trên Vercel.");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Bạn là biên kịch video 3D. Luôn trả về một JSON object hợp lệ, không markdown và không giải thích thêm." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4096,
      stream: false,
    }),
    cache: "no-store",
  });

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
  if (!response.ok) throw new Error(data.error?.message || `DeepSeek API lỗi ${response.status}.`);
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("DeepSeek không trả về nội dung kịch bản.");
  return text;
}

function parseJson(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try { return JSON.parse(cleaned); }
  catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(cleaned.slice(first, last + 1));
    throw new Error("AI trả về JSON không hợp lệ. Vui lòng tạo lại kịch bản.");
  }
}
