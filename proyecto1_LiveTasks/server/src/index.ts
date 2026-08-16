import { createApp } from './app.js';
import { env } from './config/env.js';

import './config/firebase.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Live&Tasks API escuchando en http://localhost:${env.PORT}`);
});
