import { Router } from 'express';
import * as contributionMemberController from '../controllers/contributionMemberController';
import * as contributionMiddleware from '../middlewares/contributionMiddleware';
import * as authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router
  .route('/:ref')
  .get(
    authMiddleware.protect,
    contributionMiddleware.checkMember,
    contributionMemberController.getContributionMembers,
  )
  .patch(
    authMiddleware.protect,
    contributionMiddleware.checkMember,
    contributionMiddleware.checkContributionAdmin,
    contributionMemberController.updateContributionMember,
  );

export default router;
