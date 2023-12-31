import {OpenAIStream, StreamingTextResponse} from "ai";
import {type Messages, streamChat} from "~/lib/openai/stream";

export const runtime = "edge";

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { messages } = await req.json();

  const res = await streamChat(messages as Messages);

  // Convert to stream and return
  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}