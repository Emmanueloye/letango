import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import * as authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/contribution/:groupRef',
  authMiddleware.protect,
  paymentController.validateCollection,
  paymentController.contributionCollection,
);

router.get(
  '/verify-contribution/:reference',

  authMiddleware.protect,
  paymentController.verifyPayment,
);

export default router;
