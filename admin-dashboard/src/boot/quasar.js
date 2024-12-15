// src/boot/quasar.js
import { Quasar, Notify } from 'quasar';
import 'quasar/dist/quasar.css';

export const setupQuasar = (app) => {
  app.use(Quasar, {
    plugins: {
      Notify, // Registra Notify
    },
  });
};
