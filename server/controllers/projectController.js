import Project from '../models/project.js'

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.userId }).sort({ createdAt: -1 })
    res.status(200).json(projects)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const createProject = async (req, res) => {
  try {
    const { name, description, githubRepo } = req.body
    if (!name || !githubRepo) {
      return res.status(400).json({ message: 'Name and GitHub repo required' })
    }

    const existingCount = await Project.countDocuments({ owner: req.user.userId })
    if (existingCount >= 1) {
      return res.status(402).json({ message: 'Free project limit reached. Additional projects are $5 each.' })
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || '',
      githubRepo: githubRepo.trim(),
      owner: req.user.userId
    })

    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProjectBySlug = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.userId })
    const project = projects.find(p => p.name.toLowerCase() === req.params.slug.toLowerCase())
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.status(200).json(project)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteProject = async (req, res) => {
  try {
    await Project.deleteOne({ _id: req.params.id, owner: req.user.userId })
    res.status(200).json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

import { getRepoCommits } from '../services/githubService.js'
import { processCommits } from '../services/geminiService.js'
import { generateChangelogHtml } from '../services/changelogTemplate.js'

export const deployChangelog = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (project.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' })

    const commits = await getRepoCommits(project.githubRepo)
    if (!commits || commits.length === 0) {
      return res.status(400).json({ message: 'No commits found in repo' })
    }

    const categorized = await processCommits(commits)
    const changelogHtml = generateChangelogHtml(categorized)

    project.deployment.status = 'deployed'
    project.deployment.lastDeployed = new Date()
    project.deployment.changelogHtml = changelogHtml
    project.deployment.isAutoDeployEnabled = true
    await project.save()

    res.status(200).json({ message: 'Deployed', html: changelogHtml })
  } catch (err) {
    console.error('Deploy error:', err)
    res.status(500).json({ message: 'Deployment failed' })
  }
}

export const getChangelog = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })

    res.status(200).json({ html: project.deployment.changelogHtml || '' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const stopDeploy = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (project.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' })

    project.deployment.isAutoDeployEnabled = false
    await project.save()

    res.status(200).json({ message: 'Deploy stopped' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateDeployInterval = async (req, res) => {
  try {
    const { interval } = req.body
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    if (project.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' })

    project.deployment.interval = interval
    await project.save()

    res.status(200).json({ message: 'Updated' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
