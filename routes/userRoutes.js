import express from 'express';
import {
    register,
    authenticate,
    confirm,
    returnUser,
    verifyUser,
    validateToken,
    newPassword,
    updateProfile,
    updatePassword
} from '../controllers/userController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', register );
router.get('/confirm/:token', confirm);
router.post('/login', authenticate);
router.post('/forget-password', verifyUser)
router.route('/forget-password/:token')
    .get(validateToken)
    .post(newPassword)
;

// Private routes
router.get('/admin', checkAuth, returnUser);
router.put('/admin/:id', checkAuth, updateProfile);
router.put('/password', checkAuth, updatePassword);


export default router;