import express from 'express'
import { 
  getProjects, 
  newProject, 
  getProject, 
  updateProject, 
  deleteProject, 
  getPartner,
  addPartner, 
  removePartner
} from '../controllers/projectController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

router
  .route('/')
  .get(checkAuth, getProjects)
  .post(checkAuth, newProject)

router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, updateProject)
  .delete(checkAuth, deleteProject)



router.post('/partners', checkAuth, getPartner)

router.post('/partners/:id',checkAuth, addPartner)
router.post('/delete-partner/:id', checkAuth, removePartner)



export default router