import express from 'express'
const router = express.Router();


import dotenv from 'dotenv'
import { checkAuthentication } from '../controller/login_controller.mjs';
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const damagesController = await import(`../controller/damages_controller.mjs`);
const loginController = await import(`../controller/login_controller.mjs`);


router.get('/', damagesController.showHome);
router.get('/communication', damagesController.showCommunications);
router.get('/report', damagesController.reportDamage);
router.get('/login', loginController.showLogin);
router.get('/signup', loginController.showSignup);
router.get('/recentReports', damagesController.showRecentReports);
router.get('/user_main', loginController.checkAuthentication, loginController.showUserMain);

router.post('/report', upload.single('image'), damagesController.addReport);
router.post('/login', loginController.loginUser);
router.post('/signup', loginController.signupUser);
router.post('/logout', loginController.logoutUser);

export default router;