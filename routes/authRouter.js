import express from 'express';
import {auth as authAdmin, logout as logoutAdmin} from '../controllers/admin/authAdminController.js';
import {auth, logout} from '../controllers/authController.js';

const authRouter = express.Router();

//Admin auth
authRouter.post('/auth-admin', authAdmin);
authRouter.post('/logout-admin', logoutAdmin);

//Customer auth
authRouter.post('/auth-customer', auth);
authRouter.post('/logout-customer', logout);

export default authRouter;