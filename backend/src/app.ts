// Import packages
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Import error handlers moduels
import notFoundMiddleware from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

// Import routers modules
// Import routers modules
import authRouters from './routes/authRoutes';
import userRouters from './routes/userRoutes';
import groupSettingRouters from './routes/groupSettingRoutes';
import contributionRouters from './routes/contributionRoutes';
import contributionMemberRouters from './routes/contributionMemberRoutes';
import contributionTransactionRouters from './routes/contributionTransRoutes';
import paymentRouter from './routes/paymentRoutes';
import webRouters from './routes/webhookRoutes';

// Setup application
const app = express();

// set up app wide middleware
app.use(cookieParser(process.env.JWT_SECRET));
// if (process.env.NODE_ENV === 'development')
app.use(morgan('dev'));
app.use(express.json({ limit: '20kb' }));

//==================== Serves static file ============//
// Middleware to serve static files from the client/dist directory
app.use(express.static(path.resolve(__dirname, './../../client/dist')));

// App route mounting
app.use('/api/v1/auth', authRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/group-settings', groupSettingRouters);
app.use('/api/v1/contributions', contributionRouters);
app.use('/api/v1/contribution-members', contributionMemberRouters);
app.use('/api/v1/contribution-transactions', contributionTransactionRouters);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/webhook', webRouters);

//==================== send the html file for all routes =================//
app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, './../../client/dist', 'index.html'));
});

// mount error handlers
app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;
