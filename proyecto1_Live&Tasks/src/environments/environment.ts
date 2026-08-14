export const environment = {
  production: false,
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
    url: 'http://127.0.0.1:5001/YOUR_PROJECT/us-central1/proxyGemini',
  },
};
