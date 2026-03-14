import axios from 'axios'
import fallbackProjects from './fallbackProjects'
import config from '../config'

let cachedProjects = null
let cachedContent = null

// ── Data fetchers ──────────────────────────────────────────────

async function fetchProjects() {
  try {
    const res = await axios.get(`${config.apiUrl}/api/projects`)
    cachedProjects = res.data
    return cachedProjects
  } catch {
    cachedProjects = fallbackProjects
    return cachedProjects
  }
}

async function fetchContent() {
  try {
    const res = await axios.get(`${config.apiUrl}/api/content`)
    cachedContent = res.data
    return cachedContent
  } catch {
    // Return defaults when backend is offline
    cachedContent = {
      about: {
        name: 'Shaan Shoukath',
        tagline: 'Full-stack developer & tech enthusiast passionate about building innovative solutions that make a real-world impact.',
        education: 'Computer Science & Engineering',
        location: 'India',
        focus: 'AI/ML, Robotics, Web Development',
      },
      skills: [
        { category: 'Languages', items: 'Python · JavaScript · TypeScript · C++ · Rust' },
        { category: 'Frontend', items: 'React · Next.js · TailwindCSS · Framer Motion' },
        { category: 'Backend', items: 'Node.js · Express · FastAPI · Django' },
        { category: 'Database', items: 'MongoDB · PostgreSQL · Redis · Firebase' },
        { category: 'DevOps & Tools', items: 'Docker · Git · Linux · Nginx · CI/CD' },
        { category: 'AI / ML / Robotics', items: 'TensorFlow · PyTorch · OpenCV · ROS2' },
      ],
      contact: {
        email: 'shaan@example.com',
        github: 'https://github.com/shaan-shoukath',
        linkedin: 'https://linkedin.com/in/shaan-shoukath',
      },
      coffeeUrl: 'https://buymeacoffee.com/shaan',
      resumeUrl: '/resume.pdf',
      resumeLinkedIn: 'https://linkedin.com/in/shaan-shoukath',
    }
    return cachedContent
  }
}

// ── Helpers ─────────────────────────────────────────────────────

function line(text, className = 'output-text') {
  return { type: 'text', text, className }
}

function blank() {
  return line('')
}

// ── Command dispatcher ─────────────────────────────────────────

export async function executeCommand(cmd, store, termId) {
  const input = cmd.trim()
  if (!input) return []

  const [command, ...args] = input.split(/\s+/)
  const lower = command.toLowerCase()

  switch (lower) {
    case 'help':
      return helpCommand()
    case 'about':
      return await aboutCommand()
    case 'skills':
      return await skillsCommand()
    case 'projects':
      return await projectsCommand()
    case 'resume':
      return await resumeCommand()
    case 'contact':
      return await contactCommand()
    case 'clear':
      store.clearTerminal(termId)
      return []
    case 'neofetch':
      return neofetchCommand()
    case 'newterm':
      return newtermCommand(store)
    case 'exit':
      store.removeTerminal(termId)
      return []
    case 'open':
      return await openCommand(args)
    case 'sudo':
      return sudoCommand(args)
    case 'matrix':
      store.toggleMatrix()
      return [line('  ⟩ Matrix mode toggled.', 'output-success')]
    case 'coffee':
      return await coffeeCommand()
    default:
      return [
        line(`  zsh: command not found: ${command}`, 'output-error'),
        line(`  Type 'help' to see available commands.`, 'output-muted'),
      ]
  }
}

// ── Commands ────────────────────────────────────────────────────

function helpCommand() {
  return [
    blank(),
    line('  ╔══════════════════════════════════════════╗', 'output-accent'),
    line('  ║          AVAILABLE COMMANDS               ║', 'output-accent'),
    line('  ╚══════════════════════════════════════════╝', 'output-accent'),
    blank(),
    line('  about       → Who is Shaan?', 'output-text'),
    line('  skills      → Tech stack & expertise', 'output-text'),
    line('  projects    → Browse portfolio projects', 'output-text'),
    line('  open <id>   → View project details', 'output-text'),
    line('  resume      → Open resume / CV', 'output-text'),
    line('  contact     → Get in touch', 'output-text'),
    line('  coffee      → ☕ Buy me a coffee', 'output-text'),
    line('  neofetch    → System information', 'output-text'),
    line('  matrix      → Toggle matrix rain effect', 'output-text'),
    line('  newterm     → Open new terminal (Alt+Enter)', 'output-text'),
    line('  exit        → Close this terminal (Alt+Q)', 'output-text'),
    line('  clear       → Clear terminal', 'output-text'),
    line('  sudo <cmd>  → Try your luck...', 'output-muted'),
    blank(),
    line('  ─── Keybindings ───', 'output-muted'),
    line('  Alt+Enter → New terminal    Alt+Q → Close', 'output-muted'),
    line('  Alt+W/A/S/D → Navigate terminals', 'output-muted'),
    blank(),
  ]
}

async function aboutCommand() {
  const content = cachedContent || await fetchContent()
  const a = content.about
  return [
    blank(),
    line('  ┌─── About Me ───────────────────────────┐', 'output-accent'),
    blank(),
    line(`    👋 Hey, I'm ${a.name}`, 'output-heading'),
    blank(),
    ...a.tagline.match(/.{1,50}(\s|$)/g).map(s => line(`    ${s.trim()}`, 'output-text')),
    blank(),
    line(`    🎓 Education: ${a.education}`, 'output-text'),
    line(`    📍 Location: ${a.location}`, 'output-text'),
    line(`    🔭 Focus: ${a.focus}`, 'output-text'),
    blank(),
    line('  └─────────────────────────────────────────┘', 'output-accent'),
    blank(),
  ]
}

async function skillsCommand() {
  const content = cachedContent || await fetchContent()
  const lines = [
    blank(),
    line('  ┌─── Skills & Technologies ─────────────────┐', 'output-accent'),
    blank(),
  ]

  content.skills.forEach(skill => {
    lines.push(line(`    ▸ ${skill.category}`, 'output-warning'))
    lines.push(line(`      ${skill.items}`, 'output-text'))
    lines.push(blank())
  })

  lines.push(line('  └────────────────────────────────────────────┘', 'output-accent'))
  lines.push(blank())
  return lines
}

async function projectsCommand() {
  const projects = await fetchProjects()
  const lines = [
    blank(),
    line('  ┌─── Projects ─────────────────────────────┐', 'output-accent'),
    blank(),
  ]

  projects.forEach((p, i) => {
    lines.push(line(`    [${i + 1}] ${p.title}`, 'output-heading'))
    lines.push(line(`        ${p.description.slice(0, 80)}${p.description.length > 80 ? '...' : ''}`, 'output-text'))
    lines.push(line(`        Tech: ${p.technologies.join(', ')}`, 'output-muted'))
    if (p.github) lines.push({ type: 'link', text: `        GitHub: ${p.github}`, url: p.github, className: 'output-link' })
    if (p.deployment) lines.push({ type: 'link', text: `        Live: ${p.deployment}`, url: p.deployment, className: 'output-link' })
    if (p.linkedin) lines.push({ type: 'link', text: `        LinkedIn: ${p.linkedin}`, url: p.linkedin, className: 'output-link' })
    lines.push(blank())
  })

  lines.push(line(`  ─── Type 'open <number>' for details ───`, 'output-muted'))
  lines.push(line('  └────────────────────────────────────────┘', 'output-accent'))
  lines.push(blank())

  return lines
}

async function openCommand(args) {
  if (!args[0]) {
    return [line('  Usage: open <project-number>', 'output-warning')]
  }
  const idx = parseInt(args[0]) - 1
  const projects = cachedProjects || await fetchProjects()
  if (idx < 0 || idx >= projects.length) {
    return [line(`  Project #${args[0]} not found. Run 'projects' to see list.`, 'output-error')]
  }
  const p = projects[idx]
  const lines = [
    blank(),
    line(`  ╔══ ${p.title} ══╗`, 'output-accent'),
    blank(),
    line(`    ${p.description}`, 'output-text'),
    blank(),
    line(`    Technologies:`, 'output-warning'),
    line(`      ${p.technologies.join(' · ')}`, 'output-text'),
    blank(),
  ]
  if (p.github) lines.push({ type: 'link', text: `    🔗 GitHub: ${p.github}`, url: p.github, className: 'output-link' })
  if (p.deployment) lines.push({ type: 'link', text: `    🌐 Live: ${p.deployment}`, url: p.deployment, className: 'output-link' })
  if (p.linkedin) lines.push({ type: 'link', text: `    💼 LinkedIn: ${p.linkedin}`, url: p.linkedin, className: 'output-link' })
  lines.push(blank())
  lines.push(line(`  ╚${'═'.repeat(p.title.length + 6)}╝`, 'output-accent'))
  lines.push(blank())
  return lines
}

async function resumeCommand() {
  const content = cachedContent || await fetchContent()
  return [
    blank(),
    line('  ┌─── Resume ──────────────────────────────┐', 'output-accent'),
    blank(),
    line('    📄 Resume / CV', 'output-heading'),
    blank(),
    { type: 'link', text: '    → Download PDF Resume', url: content.resumeUrl, className: 'output-link' },
    { type: 'link', text: '    → View on LinkedIn', url: content.resumeLinkedIn, className: 'output-link' },
    blank(),
    line('  └──────────────────────────────────────────┘', 'output-accent'),
    blank(),
  ]
}

async function contactCommand() {
  const content = cachedContent || await fetchContent()
  const c = content.contact
  return [
    blank(),
    line('  ┌─── Contact ─────────────────────────────┐', 'output-accent'),
    blank(),
    line('    📬 Let\'s Connect!', 'output-heading'),
    blank(),
    { type: 'link', text: `    📧 Email: ${c.email}`, url: `mailto:${c.email}`, className: 'output-link' },
    { type: 'link', text: `    🐙 GitHub: ${c.github}`, url: c.github, className: 'output-link' },
    { type: 'link', text: `    💼 LinkedIn: ${c.linkedin}`, url: c.linkedin, className: 'output-link' },
    blank(),
    line('  └──────────────────────────────────────────┘', 'output-accent'),
    blank(),
  ]
}

async function coffeeCommand() {
  const content = cachedContent || await fetchContent()
  const url = content.coffeeUrl || 'https://buymeacoffee.com/shaan'
  return [
    blank(),
    line('         ( (', 'output-warning'),
    line('          ) )', 'output-warning'),
    line('       ........', 'output-warning'),
    line('       |      |]', 'output-warning'),
    line('       \\      /', 'output-warning'),
    line('        `----\'', 'output-warning'),
    blank(),
    line('  ☕ Enjoying this portfolio? Buy me a coffee!', 'output-text'),
    blank(),
    { type: 'link', text: `    → ${url}`, url, className: 'output-link' },
    blank(),
    line('  Current status: Caffeinated ✓', 'output-success'),
    blank(),
  ]
}

function neofetchCommand() {
  return [
    { type: 'neofetch' },
  ]
}

function newtermCommand(store) {
  const success = store.addTerminal()
  if (!success) {
    return [line('  Maximum terminals reached.', 'output-warning')]
  }
  return [line('  ⟩ New terminal opened.', 'output-success')]
}

function sudoCommand(args) {
  const full = args.join(' ').toLowerCase()

  if (full === 'hire shaan') {
    return [
      blank(),
      line('  ╔═══════════════════════════════════════════╗', 'output-success'),
      line('  ║                                           ║', 'output-success'),
      line('  ║   ✅ DECISION: EXCELLENT                  ║', 'output-success'),
      line('  ║                                           ║', 'output-success'),
      line('  ║   Shaan has been hired!                   ║', 'output-success'),
      line('  ║   Starting date: Immediately              ║', 'output-success'),
      line('  ║   Salary: Yes, please 🚀                  ║', 'output-success'),
      line('  ║                                           ║', 'output-success'),
      line('  ╚═══════════════════════════════════════════╝', 'output-success'),
      blank(),
    ]
  }

  if (full === 'rm -rf /') {
    // Rickroll!
    return [
      blank(),
      line('  ☠️  Initiating system destruction...', 'output-error'),
      line('  ██████████████████ 100%', 'output-error'),
      line('  ...', 'output-muted'),
      line('  Just kidding! 😏', 'output-success'),
      blank(),
      { type: 'action', action: 'openUrl', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      line('  🎵 You\'ve been rickrolled! Never gonna give you up~', 'output-warning'),
      blank(),
    ]
  }

  if (full === 'play' || full === 'music') {
    return [
      blank(),
      line('  🎵 Opening the vibes...', 'output-success'),
      blank(),
      { type: 'action', action: 'openUrl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
      line('  ♪ lofi hip hop radio — beats to relax/study to', 'output-muted'),
      blank(),
    ]
  }

  if (full === 'meme' || full === 'memes') {
    const memes = [
      { text: '  🤖 "It works on my machine" — Every Developer Ever', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { text: '  🔥 "This is fine." — Developer in production', url: 'https://www.youtube.com/watch?v=0oBx7Jg4m-o' },
      { text: '  💀 "Let me just push to main real quick..."', url: 'https://www.youtube.com/watch?v=y8OnoxKotPQ' },
    ]
    const pick = memes[Math.floor(Math.random() * memes.length)]
    return [
      blank(),
      line(pick.text, 'output-warning'),
      blank(),
      { type: 'action', action: 'openUrl', url: pick.url },
      blank(),
    ]
  }

  return [
    line('  ⚠️  sudo: permission denied', 'output-error'),
    line('  Hint: try "sudo hire shaan" or "sudo play"', 'output-muted'),
  ]
}
