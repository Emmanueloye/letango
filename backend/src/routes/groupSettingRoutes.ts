import { Router } from 'express';
import * as groupSettingController from '../controllers/groupSettingController';
import * as authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    // authMiddleware.restrictTo('super admin'),
    groupSettingController.createGroupSettings,
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super admin'),
    groupSettingController.getGroupSettings,
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super admin'),
    groupSettingController.updateGroupSettings,
  );

export default router;
