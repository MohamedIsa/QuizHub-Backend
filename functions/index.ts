import functions from 'firebase-functions';
import express from 'express';

import { createFirebaseApp } from '../src/main';

const server = express();

createFirebaseApp(server)
  .then(() => console.log('NestJS app initialized for Firebase Functions'))
  .catch((err) => console.error('Error initializing NestJS app:', err));

export const api = functions.https.onRequest(server);
