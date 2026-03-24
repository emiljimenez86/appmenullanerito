/**
 * Configuración web de Firebase (proyecto llaneritomenu).
 * measurementId es opcional; sirve para Analytics.
 */
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBtWRwQeAlMZCiIlClPSxwSVxwtC70qjOE',
  authDomain: 'llaneritomenu.firebaseapp.com',
  projectId: 'llaneritomenu',
  storageBucket: 'llaneritomenu.firebasestorage.app',
  messagingSenderId: '489871723384',
  appId: '1:489871723384:web:523189561c0f124381968d',
  measurementId: 'G-H67S8TN78V'
};

(function () {
  var c = window.FIREBASE_CONFIG;
  window.FIREBASE_LIKES_ENABLED = Boolean(c && c.apiKey && c.projectId && c.apiKey.length > 15);
})();
