import Project from '../models/Project.js'

async function getNormalizedProjects() {
  const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1, _id: 1 })
  const needsNormalization = projects.some((project, index) => project.sortOrder !== index)

  if (needsNormalization) {
    await Project.bulkWrite(
      projects.map((project, index) => ({
        updateOne: {
          filter: { _id: project._id },
          update: { $set: { sortOrder: index } },
        },
      }))
    )

    projects.forEach((project, index) => {
      project.sortOrder = index
    })
  }

  return projects
}

// GET all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await getNormalizedProjects()
    res.json(projects)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET single project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST create project
export const createProject = async (req, res) => {
  try {
    const projects = await getNormalizedProjects()

    if (projects.length > 0) {
      await Project.updateMany(
        {},
        { $inc: { sortOrder: 1 } }
      )
    }

    const project = new Project({
      ...req.body,
      sortOrder: 0,
    })
    const saved = await project.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT update project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    await getNormalizedProjects()
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH reorder projects
export const reorderProjects = async (req, res) => {
  try {
    const { orderedIds } = req.body

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ message: 'orderedIds must be a non-empty array' })
    }

    const projects = await getNormalizedProjects()
    if (projects.length !== orderedIds.length) {
      return res.status(400).json({ message: 'Project list is out of sync. Refresh and try again.' })
    }

    const existingIds = new Set(projects.map((project) => String(project._id)))
    const requestedIds = new Set(orderedIds.map((id) => String(id)))

    if (existingIds.size !== requestedIds.size || [...existingIds].some((id) => !requestedIds.has(id))) {
      return res.status(400).json({ message: 'orderedIds must contain every project exactly once' })
    }

    await Project.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { sortOrder: index } },
        },
      }))
    )

    const updatedProjects = await Project.find().sort({ sortOrder: 1, createdAt: -1, _id: 1 })
    res.json(updatedProjects)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
