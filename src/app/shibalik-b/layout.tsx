export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex min-h-[100dvh] w-full flex-col">{children}</main>;
}