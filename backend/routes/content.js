import express from 'express'
import auth from '../middleware/auth.js'
import SiteContent from '../models/SiteContent.js'

const router = express.Router()

// GET /api/content — Public, returns all site content
router.get('/', async (req, res) => {
  try {
    const content = await SiteContent.getContent()
    res.json(content)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/content — Protected, update site content
router.put('/', auth, async (req, res) => {
  try {
    const content = await SiteContent.updateContent(req.body)
    res.json({ message: 'Content updated', content })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
