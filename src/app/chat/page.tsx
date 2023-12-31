import Chat from "~/components/chat/chat";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-700 to-black text-white">
      <h1 className={"text-6xl font-bold tracking-tight my-6"}>BeanGPT</h1>
      <Chat />
    </main>
  );
}
