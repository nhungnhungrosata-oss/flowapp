import { z } from "zod";
import { generateJson, type TextAiProvider } from "@/lib/ai";

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
export type ScriptProvider = TextAiProvider;

export type GenerateVideo3DScriptInput = {
  topic: string;
  sceneCount: number;
  style: string;
  provider: ScriptProvider;
};

type UnknownRecord = Record<string, unknown>;

const SYSTEM_PROMPT = "Bạn là biên kịch và đạo diễn video 3D chuyên nghiệp. Luôn trả về một JSON object hợp lệ, không markdown và không giải thích thêm.";

export async function generateVideo3DScript(input: GenerateVideo3DScriptInput): Promise<Video3DScript> {
  const raw = await generateJson<unknown>({
    provider: input.provider,
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildPrompt(input),
    temperature: 0.8,
    maxTokens: 4096,
  });

  return video3DScriptSchema.parse(normalizeScript(raw, input));
}

function normalizeScript(raw: unknown, input: GenerateVideo3DScriptInput): Video3DScript {
  const root = unwrapObject(raw);
  const rawScenes = pickArray(root, ["scenes", "segments", "shots", "canh", "cảnh"]);
  const topic = input.topic.trim();
  const scenes = Array.from({ length: input.sceneCount }, (_, index) => {
    const scene = asRecord(rawScenes[index]);
    const number = index + 1;
    const title = pickString(scene, ["title", "sceneTitle", "name", "tenCanh", "tieuDe", "tiêuĐề"])
      || `Cảnh ${number}`;
    const narration = pickString(scene, ["narration", "voiceover", "voiceOver", "dialogue", "script", "loiDan", "lờiDẫn", "text"])
      || `Khám phá ${topic} trong cảnh số ${number}.`;
    const visualPrompt = pickString(scene, ["visualPrompt", "videoPrompt", "prompt", "visual", "description", "moTaHinhAnh", "môTảHìnhẢnh"])
      || buildFallbackVisualPrompt(topic, input.style, number);
    const camera = pickString(scene, ["camera", "cameraMovement", "cameraMotion", "shot", "movement"])
      || "Slow cinematic dolly-in with smooth parallax and stable framing";
    const onScreenText = pickString(scene, ["onScreenText", "screenText", "textOverlay", "caption", "textOnScreen"])
      || "";

    return {
      id: pickString(scene, ["id", "sceneId", "key"]) || `scene-${number}`,
      title: truncate(title, 120),
      narration: truncate(narration, 500),
      visualPrompt: truncate(visualPrompt, 1800),
      camera: truncate(camera, 300),
      onScreenText: truncate(onScreenText, 120),
    };
  });

  const title = pickString(root, ["title", "videoTitle", "name", "tieuDe", "tiêuĐề"])
    || `Video 3D: ${topic}`;
  const concept = pickString(root, ["concept", "idea", "summary", "description", "moTa", "môTả"])
    || `Video hoạt hình 3D phong cách ${input.style.toLowerCase()} về ${topic}.`;

  return {
    title: truncate(title, 160),
    concept: truncate(concept, 500),
    scenes,
  };
}

function unwrapObject(value: unknown): UnknownRecord {
  const root = asRecord(value);
  for (const key of ["script", "data", "result", "output"]) {
    const nested = asRecord(root[key]);
    if (Object.keys(nested).length > 0) return nested;
  }
  return root;
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : {};
}

function pickString(record: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
  }
  return "";
}

function pickArray(record: UnknownRecord, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function buildFallbackVisualPrompt(topic: string, style: string, sceneNumber: number): string {
  return `Premium stylized 3D animation about ${topic}, scene ${sceneNumber}, ${style} mood, one consistent anthropomorphic character, expressive face, polished materials, cinematic lighting, clear action, smooth natural motion, detailed environment, family-friendly, no text, no logo, no watermark`;
}

function truncate(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function buildPrompt(input: GenerateVideo3DScriptInput) {
  const duration = input.sceneCount * 8;
  return `Hãy viết kịch bản video hoạt hình 3D ngắn bằng tiếng Việt.

Chủ đề: "${input.topic}".
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
- Tất cả trường JSON dưới đây đều bắt buộc.

Trả về đúng cấu trúc JSON:
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
