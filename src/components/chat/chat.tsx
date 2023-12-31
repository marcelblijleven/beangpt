"use client"

import {useChat} from "ai/react";
import {Input} from "~/components/ui/input";
import {ChatMessages} from "~/components/chat/messages";
import {useMessageStore} from "~/components/upload-form/store";

export default function Chat() {
  const initialMessages = useMessageStore(state => state.messages)
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    initialMessages,
  })

  return (
    <div className={"mx-auto w-full max-w-2xl"}>
      <ChatMessages messages={messages} />
      <form onSubmit={handleSubmit}>
        <Input
          value={input}
          placeholder={"Ask me about your coffee backlog"}
          onChange={handleInputChange}
          className={"text-foreground"}
        />
      </form>
    </div>
  )
}