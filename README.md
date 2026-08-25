

# 🐶 LogicPup

> An interactive logic simulator and circuit builder designed for intuitive learning, real-time signal propagation, and digital logic design.

![LogicPup Hero Banner](./assets/hero.png) <!-- Replace path if assets are located elsewhere, e.g., ./docs/hero.png -->

---

## 📌 Overview

**LogicPup** is a web-based digital logic gate simulator that lets users visually construct, simulate, and analyze digital circuits. Whether you are designing simple AND/OR gates or building complex multiplexers, arithmetic circuits, and sequential logic, LogicPup provides a responsive canvas with real-time feedback.

---

## ✨ Features

- ⚡ **Real-Time Simulation:** Instant logic evaluation and visual signal propagation (High/Low logic levels).
- 🔌 **Drag-and-Drop Canvas:** Intuitive UI for placing components, connecting wires, and arranging nodes.
- 🧮 **Rich Component Library:**
  - **Logic Gates:** AND, OR, NOT, NAND, NOR, XOR, XNOR.
  - **Inputs & Outputs:** Switches, Clocks, LEDs, 7-Segment Displays, Hex Displays.
  - **Complex Units:** Flip-Flops (SR, JK, D, T), Multiplexers, Demultiplexers.
- 📐 **Grid Snapping & Clean Routing:** Smart line routing and node placement for clear circuit readability.
- 💾 **Export & Import:** Save your circuit schematics to JSON and export visual diagrams.

---

## 🖼️ Visual Highlights & Assets

| Canvas & Wiring | Component Palette & State |
| :---: | :---: |
| ![Canvas & Wiring](./assets/canvas-preview.png) | ![Component State](./assets/components-preview.png) |

> *Note: Update the relative paths above (`./assets/...` or `./public/...`) to match the exact folder where your images reside in the repository.*

---

## 🛠️ Tech Stack

- **Frontend:** React / Next.js, TypeScript, Tailwind CSS
- **Canvas / Graphics:** HTML5 Canvas / SVG / React Flow
- **State Management:** Zustand / Redux / React Context
- **Testing & Tooling:** Vite / Jest, ESLint, Prettier

---

## 🚀 Getting Started

Follow these steps to set up and run LogicPup locally:

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mahesh2-lab/logicpup.git](https://github.com/mahesh2-lab/logicpup.git)
   cd logicpup

```

2. **Install dependencies:**
```bash
npm install
# or
pnpm install
# or
yarn install

```


3. **Start the development server:**
```bash
npm run dev
# or
pnpm dev
# or
yarn dev

```


4. **Open in Browser:**
Navigate to `http://localhost:3000` (or `http://localhost:5173` if using Vite) to view the application.

---

## 📁 Project Structure

```text
logicpup/
├── assets/            # Screenshots, diagrams, and project banners
├── public/            # Static files & icons
├── src/
│   ├── components/    # Canvas, sidebar, toolbar, UI elements
│   ├── engine/        # Logic evaluation algorithm & signal propagation
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript definitions for gates, pins, & wires
│   └── utils/         # Canvas math, file import/export helpers
├── package.json
└── README.md

```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git checkout -b feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

```

```
