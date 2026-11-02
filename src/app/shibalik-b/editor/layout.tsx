export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-muted/30">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-safe pt-4 md:pb-24">
        {children}
      </main>
    </div>
  );
}