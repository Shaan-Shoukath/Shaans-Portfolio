import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body

  const adminUser = process.env.ADMIN_USERNAME || 'admin'
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123'
  const jwtSecret = process.env.JWT_SECRET

  if (username !== adminUser) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  // Simple password check (use bcrypt hash in production)
  if (password !== adminPass) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Authentication is not configured on the server' })
  }

  try {
    const token = jwt.sign(
      { username, role: 'admin' },
      jwtSecret,
      { expiresIn: '24h' }
    )

    return res.json({ token, message: 'Login successful' })
  } catch {
    return res.status(500).json({ message: 'Failed to create login session' })
  }
})

export default router
