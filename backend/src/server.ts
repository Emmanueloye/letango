import 'express-async-errors';
import http from 'http';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });

import app from './app';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

// Server set up
const server = http.createServer(app);

// Database set up
mongoose
  .connect(process.env.MONGOURL as string)
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log(`name: ${err.name}, message: ${err.message}`));

// Connect with the server
const PORT = process.env.PORT || 3000;

const appServer = server.listen(PORT, () =>
  console.log(`server running on port ${PORT}`)
);

// Handle unhandled promise rejections and exit the process gracefully
process.on('unhandledRejection', (err: Error) => {
  // Log the errors
  console.error(`Unhandled Rejection ⚠⚠⚠`);
  console.error(`${err.name}: ${err.message}`);
  //   Gracefully shut down the server and exit the process
  appServer.close(() => {
    process.exit(1);
  });
});
