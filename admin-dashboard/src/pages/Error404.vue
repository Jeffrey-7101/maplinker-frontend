<!-- src/pages/Error404.vue -->
<template>
    <q-page class="flex flex-center flex-col">
      <div class="text-h4">404 - Página No Encontrada</div>
      <q-btn color="primary" label="Volver al Inicio" @click="goHome" class="q-mt-md" />
    </q-page>
  </template>
  
  <script>
  export default {
    name: 'Error404',
    methods: {
      goHome() {
        this.$router.push({ name: 'dashboard' });
      },
    },
  };
  </script>
  