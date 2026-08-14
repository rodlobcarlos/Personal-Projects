export const environment = {
  production: true,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
  gemini: {
    model: 'gemini-2.0-flash',
  },
  aiProxy: {
    url: 'https://us-central1-YOUR_PROJECT.cloudfunctions.net/proxyGemini',
  },
};
