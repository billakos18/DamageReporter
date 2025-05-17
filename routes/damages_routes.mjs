import express from 'express'
const router = express.Router();

import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    console.log('loading .env')
    dotenv.config();
}

const damagesController = await import(`../controller/damages_controller.mjs`);

router.get('/', damagesController.showHome);
router.get('/communication', damagesController.showCommunications);
router.get('/report', damagesController.reportDamage);
router.get('/login', damagesController.showLogin);
router.get('/signup', damagesController.showSignup);
router.get('/recentReports', damagesController.showRecentReports);

export default router;