import { Router } from 'express';
import * as webhookController from '../controllers/webhookController';

const router = Router();

router.post('/', webhookController.webhook);

export default router;
