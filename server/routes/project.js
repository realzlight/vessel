import express from 'express'
import { verifyAuth } from '../middlewares/verifyAuth.js'
import { 
  getProjects, 
  createProject, 
  getProjectBySlug, 
  deleteProject,
  deployChangelog,
  getChangelog,
  stopDeploy,
  updateDeployInterval
} from '../controllers/projectController.js'

const router = express.Router()

router.get('/', verifyAuth, getProjects)
router.post('/', verifyAuth, createProject)
router.get('/:slug', verifyAuth, getProjectBySlug)
router.delete('/:id', verifyAuth, deleteProject)
router.post('/:id/deploy', verifyAuth, deployChangelog)
router.get('/:id/changelog', verifyAuth, getChangelog)
router.post('/:id/stop-deploy', verifyAuth, stopDeploy)
router.put('/:id/deploy-settings', verifyAuth, updateDeployInterval)

export default router
