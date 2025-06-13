import Router from 'express';
import version1 from './version-1/index.js';
const router = Router();

router.use('/v1', version1);

export default router;