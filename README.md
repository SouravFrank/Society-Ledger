<div align="center">

<img src="public/resources/letter-header-only.png" alt="Society Ledger" width="750"/>

# Society Ledger

### A modern, simple & efficient way to manage and display your society's important documents.

<br>

<a href="https://souravfrank.github.io/Society-Ledger/">
  <img src="https://img.shields.io/badge/%F0%9F%8C%90_LIVE_SITE-souravfrank.github.io%2FSociety--Ledger-84cc16?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Site — souravfrank.github.io/Society-Ledger" width="430"/>
</a>

### 🔗 **[https://souravfrank.github.io/Society-Ledger/](https://souravfrank.github.io/Society-Ledger/)**

<br>

<a href="https://github.com/SouravFrank/Society-Ledger/actions/workflows/deploy-pages.yml">
  <img src="https://github.com/SouravFrank/Society-Ledger/actions/workflows/deploy-pages.yml/badge.svg" alt="Deploy status"/>
</a>
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/>
<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>

*Built for personal use to serve the needs of my apartment community — residents get a clean
public archive, and editors get a password-protected dashboard to publish new documents.*

</div>

---

## ✨ Features

|                        |                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| 📄 **Public Viewer**    | A clean, intuitive interface for residents to browse meeting minutes and financial statements.          |
| 🔐 **Secure Editor**    | A password-protected dashboard for administrators to manage documents.                                  |
| 🏷️ **Auto Titles**      | Document titles are generated automatically from the selected date or period, keeping the archive tidy. |
| 🎨 **Modern UI/UX**     | A responsive, polished light theme built with ShadCN UI components.                                     |
| ⚡ **Fully Static**     | Exported as a static site (App Router + Server Components) — pages load instantly from GitHub's CDN.    |

## 🚀 Tech Stack

| Layer         | Technology                                                                     |
| ------------- | ------------------------------------------------------------------------------ |
| Framework     | [Next.js](https://nextjs.org/) (App Router, static export)                      |
| Language      | [TypeScript](https://www.typescriptlang.org/)                                   |
| Styling       | [Tailwind CSS](https://tailwindcss.com/)                                        |
| UI Components | [ShadCN UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)     |
| Icons         | [Lucide React](https://lucide.dev/)                                             |
| Auth          | Cookie/`sessionStorage`-based session for the editor panel                      |
| Hosting       | [GitHub Pages](https://pages.github.com/) (deployed from the `gh-pages` branch) |

## 🛠️ Getting Started

### Prerequisites

- Node.js **v20 or later** (v24 recommended — matches CI)
- npm

### Installation & Setup

```sh
# 1. Clone the repository
git clone https://github.com/SouravFrank/Society-Ledger.git
cd Society-Ledger

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open [http://localhost:9002](http://localhost:9002):

| Route                    | Page             |
| ------------------------ | ---------------- |
| `/shibalik-b`            | Public viewer    |
| `/shibalik-b/login`      | Editor login     |
| `/shibalik-b/editor`     | Editor dashboard |

<details>
<summary><b>🔑 Editor Credentials</b></summary>

Editor access lives in [`src/data/credentials.ts`](src/data/credentials.ts).

</details>

## 📜 Available Scripts

| Command               | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `npm run dev`         | Start the dev server on port 9002                                     |
| `npm run build`       | Production build                                                      |
| `npm run build:pages` | Static export configured for GitHub Pages (`out/`)                    |
| `npm run deploy`      | Build for Pages and publish `out/` to the `gh-pages` branch           |
| `npm run typecheck`   | Run the TypeScript compiler (`tsc --noEmit`)                          |
| `npm run lint`        | Lint the codebase                                                     |
| `npm run genkit:dev`  | Start the Genkit AI flow runner (dev-time tooling)                    |

## 🌍 Deployment

> [!IMPORTANT]
> The live site is at **https://souravfrank.github.io/Society-Ledger/** —
> it deploys **automatically on every merge to `main`**.

1. The [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) workflow runs `npm run typecheck` and `npm run deploy`.
2. `deploy` builds the static export (`GITHUB_PAGES=true next build`) and pushes `out/` to the `gh-pages` branch.
3. GitHub Pages publishes the new build.

<details>
<summary><b>Manual & local deploys</b></summary>

- Trigger a deployment from the **Actions** tab (`workflow_dispatch`).
- Or publish from your machine: `npm run deploy`.

> The base path for GitHub Pages is handled in [`next.config.ts`](next.config.ts) via the `GITHUB_PAGES` environment variable.

</details>

## 📁 Project Structure

<details>
<summary><b>Browse the layout</b></summary>

```
src/
├── ai/                  # Genkit AI flows (dev-time tooling)
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Redirects to the public viewer
│   └── shibalik-b/      # Public viewer, login, and editor routes
├── components/          # App components + ShadCN UI primitives (ui/)
├── data/                # Site content (documents) and credentials
├── hooks/               # Shared React hooks
└── lib/                 # DB helpers and shared types
```

</details>

---

<div align="center">

This project was a joy to build and serves a real need for my community. Enjoy!

</div>
