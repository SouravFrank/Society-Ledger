# Society Ledger

<p align="center">
  <img src="public/resources/letter-header-only.png" alt="Society Ledger Header" width="750"/>
</p>

<p align="center">
  <a href="https://souravfrank.github.io/Society-Ledger/"><strong>🌐 View Live Site</strong></a>
</p>

<p align="center">
  A modern, simple, and efficient way to manage and display your society's important documents.
  <br />
  Built for personal use to serve the needs of my apartment community — residents get a clean
  public archive, and editors get a password-protected dashboard to publish new documents.
</p>

<p align="center">
  <a href="https://github.com/SouravFrank/Society-Ledger/actions/workflows/deploy-pages.yml">
    <img src="https://github.com/SouravFrank/Society-Ledger/actions/workflows/deploy-pages.yml/badge.svg" alt="Deploy status" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

## ✨ Features

- **Public Document Viewer:** A clean, intuitive interface for residents to browse meeting minutes and financial statements.
- **Secure Editor Dashboard:** A password-protected area for administrators to upload and manage documents.
- **Automated Title Generation:** Document titles are automatically generated from the selected date or period, keeping the archive consistent.
- **Modern UI/UX:** A responsive, polished light theme built with ShadCN UI components.
- **Fully Static & Fast:** Exported as a static site (App Router + Server Components), so pages load instantly from GitHub's CDN.

## 🚀 Tech Stack

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| Framework    | [Next.js](https://nextjs.org/) (App Router, static export)      |
| Language     | [TypeScript](https://www.typescriptlang.org/)                   |
| Styling      | [Tailwind CSS](https://tailwindcss.com/)                        |
| UI Components| [ShadCN UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Icons        | [Lucide React](https://lucide.dev/)                             |
| Auth         | Cookie-based session for the editor panel                       |
| Hosting      | [GitHub Pages](https://pages.github.com/) (deployed from the `gh-pages` branch) |

## 🛠️ Getting Started

### Prerequisites

- Node.js **v20 or later** (v24 recommended — matches CI)
- npm

### Installation & Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/SouravFrank/Society-Ledger.git
   cd Society-Ledger
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm run dev
   ```

4. **Open your browser** at [http://localhost:9002](http://localhost:9002):
   - Public viewer: `/shibalik-b`
   - Editor login: `/shibalik-b/login`

### Editor Credentials

Editor access lives in [`src/data/credentials.ts`](src/data/credentials.ts).

## 📜 Available Scripts

| Command             | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | Start the dev server on port 9002                                   |
| `npm run build`     | Production build                                                    |
| `npm run build:pages` | Static export configured for GitHub Pages (`out/`)                |
| `npm run deploy`    | Build for Pages and publish `out/` to the `gh-pages` branch         |
| `npm run typecheck` | Run the TypeScript compiler (`tsc --noEmit`)                        |
| `npm run lint`      | Lint the codebase                                                   |
| `npm run genkit:dev`| Start the Genkit AI flow runner (dev-time tooling)                  |

## 🌍 Deployment

The site deploys **automatically on every merge to `main`** via GitHub Actions:

1. The [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) workflow runs `npm run typecheck` and `npm run deploy`.
2. `deploy` builds the static export (`GITHUB_PAGES=true next build`) and pushes `out/` to the `gh-pages` branch.
3. GitHub Pages publishes the new build at https://souravfrank.github.io/Society-Ledger/.

You can also trigger a deployment manually from the **Actions** tab (`workflow_dispatch`),
or publish from your machine with `npm run deploy`.

> The base path for GitHub Pages is handled in [`next.config.ts`](next.config.ts) via the `GITHUB_PAGES` environment variable.

## 📁 Project Structure

```
src/
├── ai/                  # Genkit AI flows (dev-time tooling)
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Redirects to the public viewer
│   └── shibalik-b/      # Public viewer, login, and editor routes
├── components/          # App components + ShadCN UI primitives (ui/)
├── data/                # Site content (documents) and credentials
├── hooks/               # Shared React hooks
├── lib/                 # DB helpers and shared types
└── middleware.ts        # Route protection for the editor panel
```

---

This project was a joy to build and serves a real need for my community. Enjoy!
