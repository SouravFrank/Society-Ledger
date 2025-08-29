import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full bg-background py-4 flex justify-center">
      <div className="container px-4 md:px-6 flex justify-center">
        <Link href="/shibalik-b">
          <Image
            src="/resources/letter-header-only.png"
            alt="Society Header"
            width={2480}
            height={676}
            className="w-full h-auto max-w-4xl"
            priority
            data-ai-hint="header graphic"
          />
        </Link>
      </div>
    </header>
  );
}
