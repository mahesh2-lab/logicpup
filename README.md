<div align="center">
  <img src="./public/logo.png" alt="LogicPup logo" width="160" />

  # 🐾 LogicPup

  ### The leash-free visual Python programming environment.

  **Connect blocks. Fetch real Python. No syntax bites.**

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React Flow](https://img.shields.io/badge/@xyflow-react--flow-FF0072)](https://reactflow.dev/)
  [![Postgres](https://img.shields.io/badge/Postgres-better--auth-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

<br />

<img src="./public/hero.png" alt="LogicPup hero — teach yourself Python through visual flowcharts" width="100%" />

<br />

## What is this good boy?

**LogicPup** is a browser-based, drag-and-drop IDE that teaches Python by letting you build programs as *flowcharts* instead of typing raw syntax. Snap together blocks for variables, conditionals, loops, and functions on an infinite canvas, and LogicPup's AST engine translates your diagram into real, runnable **Python 3.12** code in real time — no missing colons, no indentation errors, no chasing your tail over a stray bracket.

It's part visual programming editor, part gamified curriculum, part in-browser IDE — think **Scratch meets a real Python REPL**, wrapped in a hand-drawn puppy theme that never stops committing to the bit.

> `if pup_knows_python == True: fetch_code_success` 🐕

---

## 🦴 Core Features

### 🧩 Visual Python Flowchart Editor
Build programs by wiring together nodes on a canvas powered by **React Flow**.
- 4-directional snap handles (Top / Bottom / Left / Right) on every block
- Direct 1:1 sync between the diagram and generated Python 3 source
- Step-by-step AST runtime simulation — watch execution "trot" through your logic node by node
- Live variable-watch scope to sniff out bugs before they run away

<img src="./public/img2.png" alt="LogicPup block editor — program canvas, block library, and generated code panel" width="100%" />

### 🎓 Structured 8-Level Python Curriculum
A gamified, locked-progression track that takes you from *puppy steps* to confident Python developer:

| Level | Topic | Focus |
|:---:|---|---|
| 1 | Variables, Input & Output | `input()`, `print()`, assignment |
| 2 | Conditionals & Branching | `if` / `elif` / `else`, comparisons |
| 3 | While Loops & Game State | `while`, `break` / `continue`, retry loops |
| 4 | For Loops, Ranges & Lists | `for item in list:`, `range()`, accumulators |
| 5 | Functions & Return Values | `def`, parameters, scope |
| 6–8 | Data structures → algorithms | Progressively harder challenges |

Clear a level's test suite to unlock the next, earn XP, and collect completion certificates along the way.

### 🖥️ In-Browser Python IDE Sandbox
Flip between three views of the exact same program:

**Flowchart → Code → Console**

- One-click export of clean, readable `.py` files
- Auto-saved node positions, wires, and variable state
- Interactive REPL-style console with stdout / stdin and step logs
- 100% client-side execution sandbox — nothing to install, nothing to configure

<img src="./public/image.png" alt="LogicPup interactive playground running the Number Guessing Game" width="100%" />

### 📁 Multi-Project Workspaces
Organize distinct scripts (Guessing Game, FizzBuzz, Grade Calculator, and beyond) as separate projects, each with its own **Overview**, **Editor**, **Runs**, and **Settings** views, full run history, and downloadable flowchart JSON + Python exports.

### 🕹️ Learn-Through-Play Arcade
Burn earned XP on built-in mini-games while you take a break from logic gates:

| Game | What you do |
|---|---|
| 🐕 **Pac-Coder** | Guide your character to the finish line, ghost-free |
| 🃏 **Memory Match** | Classic pair-matching, themed to the pack |
| ⌨️ **Code Typer** | Speed-type real code snippets to earn XP |

### 👤 Profiles, XP & Auth
Track learning streaks and cumulative XP, upload a custom avatar, and sign in with **email/password**, **GitHub**, or **Google** via [`better-auth`](https://www.better-auth.com/) — all backed by Postgres.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript |
| **Canvas Engine** | [`@xyflow/react`](https://reactflow.dev/) (React Flow) for the node-based editor |
| **Code Generation** | Custom AST parser + Python generator (`components/visual-editor/ast`, `generators/python`) |
| **State** | [Zustand](https://github.com/pmndrs/zustand) + [Zundo](https://github.com/charkour/zundo) (undo/redo history) |
| **Styling** | Tailwind CSS v4, `class-variance-authority`, custom design tokens (`design-system.json`) |
| **Auth** | [`better-auth`](https://www.better-auth.com/) — email/password, GitHub & Google OAuth |
| **Database** | PostgreSQL via `pg`, with SQL migration scripts |
| **3D / Motion** | Three.js + `motion` for landing-page flourishes |
| **Media** | Cloudinary (avatars), `react-easy-crop` |
| **Analytics** | Vercel Analytics, PostHog |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- [pnpm](https://pnpm.io/) (the project is pinned to `pnpm@11`)
- A PostgreSQL database

### 1. Clone & install

```bash
git clone https://github.com/mahesh2-lab/logicpup.git
cd logicpup
pnpm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/logicpup"
BETTER_AUTH_SECRET="a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Optional OAuth providers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 3. Set up the database

```bash
pnpm db:migrate
pnpm db:verify
```

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — fetch begins immediately. 🎾

---

## 📁 Project Structure

```text
logicpup/
├── app/                       # Next.js App Router
│   ├── page.tsx               # Marketing landing page
│   ├── dashboard/             # Learner dashboard (projects, learn, collections, settings)
│   ├── projects/[projectId]/  # Per-project overview / editor / runs / settings
│   ├── games/                 # XP arcade (Pac-Coder, Memory Match, Code Typer)
│   ├── login/                 # Auth screens
│   └── api/                   # Route handlers (auth, projects, challenges, collections)
├── components/
│   ├── landing/                # Hero, features, curriculum, CTA sections
│   ├── flow/                   # React Flow canvas for the landing-page demo
│   └── visual-editor/
│       ├── ast/                 # Flowchart → AST parser
│       ├── generators/python/   # AST → Python 3 code generator
│       ├── blocks/              # 50+ block definitions across 11 categories
│       ├── execution/           # In-browser runner / step simulator
│       ├── state/               # Zustand editor store
│       ├── projects/            # Project workspace views & store
│       ├── learning/            # 8-level curriculum data
│       └── dashboard/           # Dashboard shell & modals
├── lib/                       # auth, db pool, env validation, sound effects
├── scripts/                   # DB migration / reset / verification scripts
└── public/                    # Logo, hero art, and screenshots
```

---

## 🧠 How Code Generation Works

1. **You build** a diagram by connecting typed blocks on the canvas (Program → Variables → Logic → Loops → Functions → Data).
2. Each block carries a structured definition (`components/visual-editor/blocks/definitions.ts`) describing its ports, category, and Python equivalent.
3. The canvas graph is parsed into an **AST** (`components/visual-editor/ast/parser.ts`).
4. The AST is walked by the **Python generator** (`components/visual-editor/generators/python/generator.ts`) to emit clean, idiomatic Python 3.12 source.
5. The generated script runs in an in-browser sandbox, with output streamed to the console panel and each step highlighted back on the canvas.

---

## 🐶 Why the dog theme?

Because learning to code should feel more like fetch than obedience school. Every corner of the product commits to it — from "no leash, no syntax bites" taglines to blocks that "sniff out bugs" — turning what's normally a dry compiler pipeline into something that's actually fun to read about.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-trick`
3. Commit your changes: `git commit -m "Add amazing trick"`
4. Push to the branch: `git push origin feature/amazing-trick`
5. Open a Pull Request

---

## 📜 License

No license file is currently published in this repository. Check with the maintainer ([@mahesh2-lab](https://github.com/mahesh2-lab)) before reuse or distribution.

<br />

<div align="center">
  <sub>Built with 🧡 for anyone who ever got stuck on a missing colon.</sub>
</div>
