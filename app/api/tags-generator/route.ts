import { TagSchema } from "@/schemas/Tags";
import { streamObject } from "ai";
export const maxDuration = 30;
export async function POST(req: Request) {
  // const { videoDescription, videoTitle } = await req.json();
  const prompt = await req.json();
  const result = streamObject({
    model: "openai/gpt-5.1-instant",
    schema: TagSchema,
    prompt,
  });

  return result.toTextStreamResponse();
}
