import { Router } from 'express';
import * as contributionController from '../controllers/contributionController';
import * as authMiddleware from '../middlewares/authMiddleware';
import * as contributionMiddleware from '../middlewares/contributionMiddleware';
import * as contributionImageMiddleware from '../middlewares/contributionImageMiddleware';

const router = Router();

router.post(
  '/',
  authMiddleware.protect,
  contributionController.createContributionGroup,
);

router.post(
  '/join',
  authMiddleware.protect,
  contributionController.joinContribution,
);

router.get(
  '/',
  authMiddleware.protect,
  contributionController.getUserContributionGroups,
);

router.patch(
  '/add-admin/:ref',
  authMiddleware.protect,
  contributionMiddleware.checkMember,
  contributionMiddleware.checkContributionAdmin,
  contributionController.updateContributionAdmin,
);

/*============== Contribution admin routes ================ */

router.get(
  '/admin',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  contributionController.getContributions,
);

router.get(
  '/admin/:ref',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  contributionController.getContribution,
);

router.patch(
  '/admin/:ref',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  contributionController.updateContribution,
);

/*============== Contribution Member routes ================ */

router.get(
  '/:ref',
  authMiddleware.protect,
  contributionMiddleware.joinContributionParams,
  contributionMiddleware.checkMember,
  contributionController.getContributionGroup,
);

router.patch(
  '/:ref',
  authMiddleware.protect,
  contributionImageMiddleware.logoUpload,
  contributionImageMiddleware.processImage,
  contributionMiddleware.checkMember,
  contributionMiddleware.checkContributionAdmin,
  contributionController.updateContribution,
);

export default router;
