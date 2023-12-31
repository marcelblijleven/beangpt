import {OpenAIStream, StreamingTextResponse} from "ai";
import {type Messages, streamChat} from "~/lib/openai/stream";

export const runtime = "edge";

interface RequestWithJSON extends Request {
  json: () => Promise<{messages: Messages}>
}

export async function POST(req: RequestWithJSON) {
  const { messages } = await req.json();

  const res = await streamChat(messages);

  // Convert to stream and return
  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}