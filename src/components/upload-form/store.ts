import { create } from "zustand";
import {type Message} from "ai";

interface MessageStore {
  pending: boolean;
  messages: Message[];
  setPending: (value: boolean) => void;
  updateMessages: (...message: Message[]) => void;
}

/**
 * Stores messages
 */
export const useMessageStore = create<MessageStore>()((set) => ({
  pending: false,
  messages: [],
  setPending: (value: boolean) => ({pending: value}),
  updateMessages: (...messages ) => set(state => ({messages: [...state.messages, ...messages]})),
}));