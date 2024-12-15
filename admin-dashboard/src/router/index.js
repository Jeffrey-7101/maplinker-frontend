import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const Router = createRouter({
  history: createWebHistory(), // Utiliza history para URLs limpias
  routes
});

export default Router;
