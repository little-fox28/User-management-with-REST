import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import router from './Router';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;

app.use(
  cors({
    credentials: true,
  }),
  compression(),
  cookieParser(),
  bodyParser.json()
);

const server = http.createServer(app);

mongoose.Promise = Promise;
mongoose.connect(URI);
mongoose.connection.on('error', (error: Error) => console.log(error));
const isDBConnected = mongoose.connection.readyState;

if (isDBConnected === 2) {
  console.log('🗄️  Database connected...');
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost: ${PORT}...`);
  });
}

app.use('/', router());
