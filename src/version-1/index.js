import Router from 'express';
import authMiddleware from '../middleware/auth.js';
import Auth from './Auth/index.js';

const app = Router();

//without middleware routes
app.use('/auth', Auth);


// Middleware to handle authentication
app.use(authMiddleware);

// with middleware routes

export default app;