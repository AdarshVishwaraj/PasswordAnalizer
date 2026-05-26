# 🔐 PassCrack AI

<div align="center">

**A cyberpunk-themed password strength analyzer powered by Claude AI**

![Node.js](https://img.shields.io/badge/Node.js-required-339933?logo=node.js&logoColor=white)
![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-blueviolet?logo=anthropic)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

## Overview

PassCrack AI is a browser-based password security tool with a hacker-terminal aesthetic. It combines real-time local analysis with Claude AI-powered expert feedback to give you a complete picture of your password's strength — from entropy calculations to simulated attack scenarios.

---

## Features

### 🧠 AI Security Expert
Get on-demand analysis from Claude Sonnet. Paste in a password and receive:
- A verdict with risk level (CRITICAL / HIGH / MEDIUM / LOW / FORTRESS)
- Explanation referencing your actual entropy, score, and detected patterns
- Top threats specific to your password's weaknesses
- Concrete improvement suggestions
- A relevant cybersecurity insight

### 📊 Real-Time Strength Analysis
All analysis runs locally in your browser as you type:
- **Strength score** (0–100) with animated segment meter
- **Letter grade** (F → A+)
- **Entropy** in bits
- **Character pool breakdown** — lowercase, uppercase, digits, symbols
- **Combinations** (e.g. 2.3T possible combinations)
- **Complexity checks** — 10 pass/fail criteria including length tiers, character classes, common password detection, leet-speak detection, and keyboard walk detection

### ⏱️ Crack Time Matrix
Estimated time-to-crack under four real-world attack scenarios:
| Scenario | Speed |
|---|---|
| Online throttled | 100 attempts/hr |
| Online unthrottled | 10,000/sec |
| Offline GPU (RTX 4090) | 1 billion/sec |
| Botnet cluster | 1 trillion/sec |

### ⚔️ Attack Simulator (Educational)
Two simulated attacks run directly in the browser:

**Dictionary Attack** — tests your password against 50 common passwords plus 400+ mutations (capitalization, number-appending, leet-speak variants like `@→a`, `3→e`). Mimics real-world credential stuffing.

**Brute Force** — exhaustive character-by-character iteration (CPU-limited to 300k attempts for short passwords; theoretical GPU projection for longer ones). Shows live attempt count, hash rate, and progress bar.

### 🔑 Password Generator
Generates 4 strong passwords on demand using `crypto.getRandomValues()` (cryptographically secure):
- 2× random character passwords (configurable length 12–32)
- 2× passphrases (4 words + separator + number)
- Adjustable: length slider, symbols toggle, uppercase toggle, digits toggle
- Each result shows score, entropy, grade, and a one-click COPY button

### #️⃣ Hash View
Live hash representations of your current password:
| Algorithm | Notes |
|---|---|
| MD5 | Broken — shown for educational comparison |
| SHA-1 | Deprecated — collisions found 2017 |
| SHA-256 | Secure — used in Bitcoin, TLS |
| bcrypt | Recommended for password storage; slow by design |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS — no framework, no build step |
| Fonts | Share Tech Mono, Rajdhani (Google Fonts) |
| Hashing | Web Crypto API (`crypto.subtle`) |
| RNG | `crypto.getRandomValues()` |
| Backend | Node.js (built-in `http` / `https` modules) |
| AI | Anthropic Claude Sonnet (`claude-sonnet-4-20250514`) |

---

## Prerequisites

- [Node.js](https://nodejs.org) (any modern LTS version)
- An [Anthropic API key](https://console.anthropic.com)

---

## Setup

### 1. Get the files

Make sure both files are in the **same folder**:

```
your-folder/
├── server.js
└── password_analyzer_gui.html
```

### 2. Start the server

**macOS / Linux**
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here node server.js
```

**Windows — Command Prompt**
```cmd
set ANTHROPIC_API_KEY=sk-ant-your-key-here && node server.js
```

**Windows — PowerShell**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"; node server.js
```

You should see:
```
  ╔══════════════════════════════════════╗
  ║   PassCrack AI — Server Running      ║
  ╠══════════════════════════════════════╣
  ║   URL  →  http://localhost:3000       ║
  ║   Stop →  Ctrl + C                   ║
  ╚══════════════════════════════════════╝

  ✓  API key loaded
```

### 3. Open in your browser

Go to **[http://localhost:3000](http://localhost:3000)**

---

## Architecture

```
Browser (password_analyzer_gui.html)
    │
    │  POST /api/analyze   ← no API key in browser
    ▼
server.js  (Node.js, your machine)
    │
    │  injects API key server-side
    ▼
Anthropic API  →  Claude Sonnet response
    │
    ▼
server.js  →  Browser  →  rendered in AI panel
```

The API key **never leaves your machine** — it is injected by `server.js` on each request and never sent to or stored in the browser.

---

## How the Scoring Works

The strength score (0–100) is calculated as:

1. **Base score** from entropy: `min(90, entropy_bits × 1.6)`
2. **Bonus** +2 per passing complexity check (up to 10 checks)
3. **Penalties** applied for:
   - Common password match: −45
   - Leet-speak variant of common password: −30
   - Keyboard walk pattern (e.g. `qwerty`, `1qaz`): −20
   - Repeated character sequence: −12
   - Sequential number pattern (e.g. `123`, `987`): −10
   - Letters-only: −8
   - Digits-only: −15

Grade thresholds: **A+** ≥92 · **A** ≥78 · **B** ≥62 · **C** ≥46 · **D** ≥28 · **F** <28

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot connect` | Make sure `server.js` is running |
| `API key warning` in console | Set `ANTHROPIC_API_KEY` before running node |
| `AI_ERROR` in the panel | Check your API key is valid and has credits |
| Port 3000 already in use | Change `const PORT = 3000` in `server.js` |
| `node: command not found` | Install Node.js from [nodejs.org](https://nodejs.org) |

---

## Security Notes

- **No data is stored.** Passwords are analyzed in-memory only and never written to disk or logged.
- **No external requests from the browser.** The HTML file only calls `localhost` — not the Anthropic API directly.
- **For educational use.** The attack simulator is intentionally CPU-limited and does not represent real attacker capability.
- Do not use this tool to analyze passwords you are actively using in production systems.

---

## License

MIT — free to use, modify, and distribute.
