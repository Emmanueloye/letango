import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', authController.validateSignup, authController.signup);

router.post(
  '/verify-email',
  authController.switchVerifyEmailBody,
  authController.verifyEmail,
);

router.post('/login', authController.validateLogin, authController.login);
router.post(
  '/forget-password',
  authController.switchVerifyEmailBody,
  authController.forgetPassword,
);
router.post(
  '/reset-password',
  authController.validateResetPassword,
  authController.switchVerifyEmailBody,
  authController.resetPassword,
);

router.delete('/logout', authMiddleware.protect, authController.logout);

export default router;
