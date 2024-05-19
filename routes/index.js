import customerRouter from './customerRouter.js';
import adminRouter from './adminRouter.js';
import authRouter from './authRouter.js';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware.js';

const router = (app) => {
    app.use('/api/customer', customerRouter);
    app.use('/api/admin', authorizeMiddleware, adminRouter);
    app.use('/api/auth', authRouter);
}

export default router;