# PassCrack AI — Setup Guide

## What you need
- Node.js installed (https://nodejs.org)
- An Anthropic API key (https://console.anthropic.com)

---

## Folder structure
Make sure both files are in the SAME folder:

```
your-folder/
├── server.js
└── password_analyzer_gui.html
```

---

## How to run

### Step 1 — Open a terminal in your folder

### Step 2 — Start the server with your API key

**Mac / Linux:**
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here node server.js
```

**Windows (Command Prompt):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-your-key-here && node server.js
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"; node server.js
```

### Step 3 — Open your browser

Go to: **http://localhost:3000**

---

## How it works

```
Browser (HTML)
    │
    │  POST /api/analyze  (no API key exposed)
    ▼
server.js  (your machine)
    │
    │  adds API key securely
    ▼
Anthropic API  →  Claude AI response
    │
    ▼
server.js  →  Browser  →  Displayed in panel
```

The API key never touches the browser — it stays safely in server.js.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot connect" | Make sure server.js is running |
| "API key warning" | Set ANTHROPIC_API_KEY before running |
| Port 3000 in use | Change `const PORT = 3000` in server.js |
| Node not found | Install from nodejs.org |
