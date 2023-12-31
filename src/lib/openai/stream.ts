"use server"

import type OpenAI from "openai";
import client from "~/lib/openai/client";

export type Messages = OpenAI.Chat.Completions.ChatCompletionMessageParam[];

export async function chat(messages: Messages) {
  return client.chat.completions.create({
    messages: messages,
    model: "gpt-4",
    stream: false,
  });
}

export async function streamChat(messages: Messages) {
  return client.chat.completions.create({
    messages: messages,
    model: "gpt-4",
    stream: true,
  });
}

export async function instruct(messages: Messages) {
  return await chat(messages);
}
