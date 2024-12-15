const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue'), name: 'dashboard' },
      { path: 'nodos', component: () => import('pages/Nodos.vue'), name: 'nodos' },
      { path: 'conexiones', component: () => import('pages/Conexiones.vue'), name: 'conexiones' },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes; // Solo exporta el array de rutas
