# Hyprland Terminal Portfolio — Implementation Plan

A developer portfolio website that simulates a Hyprland + Alacritty Linux terminal environment. Visitors explore the portfolio via interactive shell commands inside glassmorphism terminal windows.

## Proposed Changes

### Project Initialization

#### [NEW] Vite + React Project
- Initialize with `npx -y create-vite@latest ./ --template react`
- Install dependencies: `tailwindcss`, `@tailwindcss/vite`, `framer-motion`, `zustand`
- Configure TailwindCSS v4 via Vite plugin
- Add JetBrains Mono from Google Fonts

---

### Core UI Layer

#### [NEW] [index.css](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/index.css)
- TailwindCSS import + custom CSS variables
- Glassmorphism utilities (`.glass-panel`, `.glass-terminal`)
- Terminal styling (scrollbar, text colors, prompt)
- Matrix rain animation keyframes
- Desktop background blur styling

#### [NEW] [App.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/App.jsx)
- Root component: renders desktop background + terminal layout
- Manages global terminal state via Zustand store
- Detects mobile vs desktop

---

### Terminal Store (State Management)

#### [NEW] [terminalStore.js](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/store/terminalStore.js)
- Zustand store managing array of terminal instances
- Each terminal: `{ id, history: [], input: "", isBooted }`
- Actions: `addTerminal`, `removeTerminal`, `setActiveTerminal`, `pushHistory`, `setInput`, `clearHistory`
- Max 4 terminals on desktop, 1 on mobile
- Active terminal tracking for focus

---

### Terminal Components

#### [NEW] [TerminalWindow.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/components/TerminalWindow.jsx)
- Glassmorphism container with title bar (● ● ● dots)
- Active/inactive border highlight
- Framer Motion mount/unmount animations
- Auto-scroll to bottom on new output
- Click-to-focus handler

#### [NEW] [TerminalOutput.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/components/TerminalOutput.jsx)
- Renders command history (prompt + output pairs)
- Supports styled output (colored text, links)
- CTRL+Click / CMD+Click hyperlink behavior
- Mobile tap-to-open links

#### [NEW] [TerminalInput.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/components/TerminalInput.jsx)
- Prompt display (`shaan@portfolio ~ $`)
- Text input field (monospace, transparent)
- Enter to execute command
- Command history navigation (up/down arrows)

---

### Terminal Layout

#### [NEW] [TerminalLayout.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/layouts/TerminalLayout.jsx)
- Computes layout grid based on terminal count (1/2/3/4)
- 1: centered, 2: vertical split, 3: 1 large + 2 stacked, 4: 2×2 grid
- CSS Grid for positioning
- Framer Motion layout animations

---

### Command System

#### [NEW] [parser.js](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/terminal/parser.js)
- Parses input string into command + args
- Routes to appropriate command handler
- Returns error for unknown commands

#### [NEW] Command Files (`src/terminal/commands/`)
Each command is a separate module returning an array of output objects:

| File | Description |
|------|-------------|
| `help.js` | List available commands |
| `about.js` | Bio and focus areas |
| `skills.js` | Programming, web, robotics skills |
| `projects.js` | Fetches from API or local fallback data |
| `resume.js` | Triggers glass resume viewer panel |
| `contact.js` | Contact info and links |
| `clear.js` | Clears terminal history |
| `neofetch.js` | ASCII art + system info |
| `newterm.js` | Opens new terminal (max 4) |
| `exit.js` | Closes current terminal |
| `open.js` | Opens project detail by index |
| `sudo.js` | Easter egg: `sudo hire shaan` |
| `matrix.js` | Matrix rain animation toggle |
| `coffee.js` | Caffeine error joke |
| `hyprland.js` | Hyprland config preview |

---

### Boot Sequence

#### [NEW] [BootSequence.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/components/BootSequence.jsx)
- Typewriter effect for boot messages
- Auto-runs neofetch after boot text
- Shows "Type help to explore" hint
- Runs only on first terminal load

---

### Special UI Components

#### [NEW] [ResumeViewer.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/components/ResumeViewer.jsx)
- Glassmorphism overlay panel
- Displays resume data (education, experience, skills)
- Close button / ESC to dismiss

#### [NEW] [MatrixRain.jsx](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/src/components/MatrixRain.jsx)
- Canvas-based matrix rain animation
- Toggleable via `matrix` command
- Renders behind terminals

---

### Backend API

#### [NEW] [server/index.js](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/server/index.js)
- Express server with CORS
- MongoDB Atlas connection
- Routes: `/api/projects`, `/api/skills`, `/api/resume`

#### [NEW] [server/seed.js](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/server/seed.js)
- Seeds MongoDB with sample project/skills/resume data

> [!IMPORTANT]
> The frontend will include **local fallback data** so the portfolio works fully without the backend running. The backend is optional for dynamic data.

---

### Static Assets

#### [NEW] [public/wallpaper.jpg](file:///c:/Users/SHAANS-PREDATOR/Downloads/TinkerSpace/portfolio/public/wallpaper.jpg)
- AI-generated Hyprland-style dark desktop wallpaper

---

## Verification Plan

### Automated Tests
- `npm run build` — Verify the production build succeeds with zero errors

### Browser Verification (via browser tool)
1. Open `http://localhost:5173` after running `npm run dev`
2. Verify boot sequence animation plays (neofetch output visible)
3. Type `help` — verify command list appears
4. Type `about`, `skills`, `contact`, `neofetch` — verify each outputs correctly
5. Type `newterm` — verify second terminal appears in split layout
6. Type `newterm` twice more — verify 4-terminal 2×2 grid, then "Maximum terminals reached"
7. Click different terminals — verify focus border changes
8. Type `exit` — verify terminal closes and layout recalculates
9. Type `clear` — verify terminal output is cleared
10. Test easter eggs: `matrix`, `coffee`, `sudo hire shaan`
11. Resize to mobile viewport — verify single fullscreen terminal
12. On mobile, type `newterm` — verify "not supported on mobile" message

### Manual Verification (by user)
- Deploy to Vercel and visit on a real mobile device to confirm mobile layout
- Verify CTRL+Click links open in new tabs on desktop
- Confirm the overall visual feel matches the Hyprland + glassmorphism aesthetic
