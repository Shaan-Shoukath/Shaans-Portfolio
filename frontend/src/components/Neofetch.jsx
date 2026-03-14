import React from 'react'

// ASCII portrait using only safe characters (no backslashes or quotes that JS mangles)
const asciiLines = [
  '       .:::::::::::.       ',
  "     .'             '.     ",
  '    :   .--"""""--.   :    ',
  '    :  /  o     o  |  :    ',
  '    :  |    ___    |  :    ',
  '    :  |   |___|   |  :    ',
  "    ':  '-..___..-'  :'    ",
  "     ':     ___     :'     ",
  '   ___|.   / S |   .|___  ',
  '  /   | `-.___.-` |   |   ',
  ' /    |    | |    |    |   ',
  '/_____|____|_|____|_____|  ',
  '      |    | |    |        ',
  '      |____|_|____|        ',
  "      /    | |    |        ",
  "     '-----' '-----'      ",
]

const ascii = asciiLines.join('\n')

const colors = [
  '#ff5f57', '#febc2e', '#28c840', '#06b6d4',
  '#8b5cf6', '#f43f5e', '#f59e0b', '#e2e8f0',
]

export default function Neofetch() {
  const info = [
    { label: 'OS', value: 'ShaanOS 2.0 (Hyprland)' },
    { label: 'Host', value: 'Terminal Portfolio v2.0' },
    { label: 'Kernel', value: 'React 19 + Vite 6' },
    { label: 'Shell', value: 'zsh 5.9 (shaan@portfolio)' },
    { label: 'WM', value: 'Hyprland (Dynamic Tiling)' },
    { label: 'Terminal', value: 'Alacritty (Glassmorphism)' },
    { label: 'Theme', value: 'Catppuccin Mocha [Dark]' },
    { label: 'Font', value: 'JetBrains Mono 14px' },
    { label: 'CPU', value: 'Caffeine-Powered Brain' },
    { label: 'GPU', value: 'Matrix Rain Accelerated' },
    { label: 'Memory', value: 'Unlimited Ideas' },
    { label: 'Uptime', value: 'Since first Hello World' },
  ]

  return (
    <div className="neofetch-container">
      <pre className="neofetch-ascii">{ascii}</pre>
      <div className="neofetch-info">
        <div className="info-line">
          <span className="info-label">shaan</span>
          <span className="info-value">@</span>
          <span className="info-label">portfolio</span>
        </div>
        <div className="info-line" style={{ color: 'var(--text-muted)' }}>
          {'─'.repeat(24)}
        </div>
        {info.map((item, i) => (
          <div className="info-line" key={i}>
            <span className="info-label">{item.label}: </span>
            <span className="info-value">{item.value}</span>
          </div>
        ))}
        <div className="neofetch-colors">
          {colors.map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  )
}
