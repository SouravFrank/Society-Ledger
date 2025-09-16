import Link from 'next/link';
import Image from 'next/image';
import { repoName } from '../../next.config';

export function Header() {
  const isGithubPages = process.env.GITHUB_PAGES === 'true';
  const imageSource = `${isGithubPages ? `/${repoName}` : ""}/resources/letter-header-only.png`

  return (
    <header className="w-full bg-background py-4 flex justify-center">
      <div className="container px-4 md:px-6 flex justify-center">
        <Link href="/">
          <Image
            src={imageSource}
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
