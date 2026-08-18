import { createApp } from './app.js';
import { env } from './config/env.js';

import './config/firebase.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Life&Tasks API escuchando en http://localhost:${env.PORT}`);
});
