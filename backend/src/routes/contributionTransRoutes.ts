import { Router } from 'express';
import * as contributionTransactionController from '../controllers/contributionTransactionController';
import * as authMiddleware from '../middlewares/authMiddleware';
import * as contributionMiddleware from '../middlewares/contributionMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    contributionMiddleware.checkMember,
    contributionMiddleware.checkContributionAdmin,
    contributionTransactionController.validateContributionWithdrawal,
    contributionTransactionController.contributionWithdrawal,
  );

router.get(
  '/',
  authMiddleware.protect,
  contributionMiddleware.checkMember,
  contributionTransactionController.getAllContributionTransactions,
);

// For admin use only
router.get(
  '/admin',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  contributionTransactionController.getAllContributionTransactions,
);

router.get(
  '/transactions',
  authMiddleware.protect,
  contributionMiddleware.checkMember,
  contributionTransactionController.getMyContributionTransactions,
);

router.get(
  '/admin/:withdrawalId',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  contributionTransactionController.getWithdrawal,
);

router.patch(
  '/admin/process',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  contributionTransactionController.processWithdrawal,
);

export default router;
