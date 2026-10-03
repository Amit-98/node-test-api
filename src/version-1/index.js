import Router from 'express';
import authMiddleware from '../middleware/auth.js';
import Auth from './Auth/index.js';
import User from './User/index.js';
import Admin from './admin/index.js';

const app = Router();

//without middleware routes
app.use('/auth', Auth);
app.use('/admin', Admin);

// Middleware to handle authentication
app.use(authMiddleware);

// with middleware routes
app.use('/user', User);



export default app;