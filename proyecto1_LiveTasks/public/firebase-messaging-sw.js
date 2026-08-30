// Service Worker de Firebase Messaging (notificaciones push en background).
// Se registra automáticamente en /firebase-messaging-sw.js por FCM vía getToken.
// Nota: el SDK de messaging para SW (firebase/messaging/sw) es ESM y no se
// puede hostear sin bundler en hosting estático; por eso usamos la CDN oficial
// de Firebase (compat), que sigue siendo el método recomendado para background.
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCO5EbpYpJUiKB7VbLib0DgNNdrM8f_hLE',
  authDomain: 'livetasks-6bac8.firebaseapp.com',
  projectId: 'livetasks-6bac8',
  storageBucket: 'livetasks-6bac8.firebasestorage.app',
  messagingSenderId: '486334737540',
  appId: '1:486334737540:web:df3cb54ef1c3d4b37726d1',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification && payload.notification.title;
  const options = {
    body: payload.notification && payload.notification.body,
    icon: '/assets/logoApp.png',
  };
  self.registration.showNotification(title, options);
});
