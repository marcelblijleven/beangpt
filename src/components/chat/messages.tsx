import {type Message} from "ai";
import {type ReactNode} from "react";
import {cn} from "~/lib/utils";

export interface MessagesProps {
  messages: Message[]
}

function ChatMessage({message}: {message: Message}) {
  const role = message.role;

  return (
    <div className={cn(
      "flex rounded-lg p-4 my-2",
      role === "user" ? "bg-gray-500/20 flex-row-reverse" : "bg-white/20")}>
      {message.content}
    </div>
  )
}

export function ChatMessages({messages}: MessagesProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      className={"relative flex flex-col justify-end mx-auto w-full max-w-2-xl min-h-[600px] max-h-[600px] overflow-y-auto"}
      style={{
        maskImage: "linear-gradient(to top, black 50%, transparent 100%)",

      }}
    >
      {messages.reduce((prev: ReactNode[], curr, idx) => {
        if (curr.role === "system") {
          return prev;
        }
        prev.push(<ChatMessage key={idx} message={curr} />)

        return prev;
      }, [])}
    </div>
  )
}