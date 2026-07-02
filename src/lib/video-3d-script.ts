import { z } from "zod";
import { generateJson, type TextAiProvider } from "@/lib/ai/text-generation";

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

const SYSTEM_PROMPT = "Bạn là biên kịch và đạo diễn video 3D chuyên nghiệp. Luôn trả về một JSON object hợp lệ, không markdown và không giải thích thêm.";

export async function generateVideo3DScript(input: GenerateVideo3DScriptInput): Promise<Video3DScript> {
  const result = await generateJson<unknown>({
    provider: input.provider,
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildPrompt(input),
    temperature: 0.8,
    maxTokens: 4096,
  });

  const script = video3DScriptSchema.parse(result);
  if (script.scenes.length !== input.sceneCount) {
    throw new Error(`AI trả về ${script.scenes.length} cảnh thay vì ${input.sceneCount} cảnh.`);
  }
  return script;
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
