import { RequestHandler, Router } from 'express';
import * as userController from '../controllers/userController';
import * as authMiddleware from '../middlewares/authMiddleware';
import * as userImageMiddleware from '../middlewares/userImageMiddleware';

const router = Router();

router.get(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  userController.getUsers,
);
router.get('/me', authMiddleware.protect, userController.getMe);

router.get(
  '/get-user/:userRef',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  userController.getUser,
);

router.patch(
  '/updateMe',
  authMiddleware.protect,
  userImageMiddleware.userImageUpload,
  userImageMiddleware.processUserImage,
  // userController.validateUpdateMe,
  userController.updateMe,
);

router.patch(
  '/change-password',
  authMiddleware.protect,
  userController.validateChangeMyPassword,
  userController.changeMyPassword,
);

router.patch(
  '/:userRef',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super admin'),
  userController.UpdateUser,
);

export default router;
