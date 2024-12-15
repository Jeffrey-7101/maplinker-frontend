<template>
    <q-page padding>
      <div class="q-gutter-md">
        <MapView />
      </div>
    </q-page>
  </template>
  
  <script>
  import MapView from 'components/MapView.vue';
  
  export default {
    name: 'Dashboard',
    components: {
      MapView,
    },
  };
  </script>
  