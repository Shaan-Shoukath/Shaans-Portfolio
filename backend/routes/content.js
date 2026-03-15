import express from 'express'
import multer from 'multer'
import auth from '../middleware/auth.js'
import SiteContent from '../models/SiteContent.js'

const router = express.Router()

// Configure multer for audio uploads (memory storage, max 3MB)
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio files are allowed'), false)
    }
  },
})

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

// POST /api/content/audio/:field — Upload MP3 for meme or shake
// :field = 'meme' or 'shake'
router.post('/audio/:field', auth, audioUpload.single('audio'), async (req, res) => {
  try {
    const { field } = req.params
    if (!['meme', 'shake'].includes(field)) {
      return res.status(400).json({ message: 'Field must be "meme" or "shake"' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No audio file uploaded' })
    }

    // Convert to base64 data URL
    const base64 = req.file.buffer.toString('base64')
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`

    // Save to the appropriate field
    const fieldName = field === 'meme' ? 'memeAudioUrl' : 'shakeAudioUrl'
    const content = await SiteContent.updateContent({ [fieldName]: dataUrl })

    res.json({
      message: `${field} audio uploaded`,
      filename: req.file.originalname,
      fieldName,
    })
  } catch (err) {
    console.error('Audio upload error:', err)
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/content/audio/:field — Remove audio
router.delete('/audio/:field', auth, async (req, res) => {
  try {
    const { field } = req.params
    if (!['meme', 'shake'].includes(field)) {
      return res.status(400).json({ message: 'Field must be "meme" or "shake"' })
    }
    const fieldName = field === 'meme' ? 'memeAudioUrl' : 'shakeAudioUrl'
    await SiteContent.updateContent({ [fieldName]: '' })
    res.json({ message: `${field} audio removed` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
