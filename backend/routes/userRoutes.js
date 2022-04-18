import express from 'express'
import { 
  register, 
  authenticate, 
  confirm, 
  forgotPassword,
  checkToken,
  newPassword,
  profile
} from '../controllers/userController.js'
import checkAuth from '../middleware/checkAuth.js'
const router = express.Router()

// Authentication, registration and confirmation of users
router.post('/', register) // Register a new user
router.post('/login', authenticate) // Login a user
router.get('/confirm/:token', confirm) // Confirm a user
router.post('/forgot-password', forgotPassword) // Forgot password
router.get('/forgot-password/:token', checkToken) // Check token
router.route('/forgot-password/:token').get(checkToken).post(newPassword) // Check token and new password
router.get('/profile', checkAuth, profile) // Access to the profile

export default router