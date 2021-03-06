import './registerServiceWorker';
import './assets/tailwind.css';
import { AuthorizationError, NotFoundError } from './utils/errors';
import App from './App.vue';
import Vue from 'vue';
import firebase from 'firebase';
import router from './router';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

Vue.config.errorHandler = error => {
  if (error instanceof AuthorizationError || error instanceof NotFoundError) {
    console.warn(`${error.name}: ${error.message}\n${error.stack}`);
  } else {
    console.error(error);
  }
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
