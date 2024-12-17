<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Encabezado -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn 
          flat dense round 
          icon="menu" 
          @click="toggleDrawer" 
          aria-label="Menu" 
        />
        <q-toolbar-title class="text-weight-bold">
          MapLinker App
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Barra lateral -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- Cabecera del Sidebar -->
      <q-item class="bg-grey-3 q-py-md">
        <q-item-section avatar>
          <q-icon name="account_circle" color="primary" size="lg" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold">User</q-item-label>
          <q-item-label caption>admin@example.com</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- Menú de Navegación -->
      <q-list>
        <q-item-label header>Menú</q-item-label>

        <q-item 
          clickable v-ripple 
          @click="navigateTo('dashboard')" 
          :active="isActive('dashboard')" 
          active-class="menu-active"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item 
          clickable v-ripple 
          @click="navigateTo('nodos')" 
          :active="isActive('nodos')" 
          active-class="menu-active"
        >
          <q-item-section avatar>
            <q-icon name="place" />
          </q-item-section>
          <q-item-section>Nodos</q-item-section>
        </q-item>

        <q-item 
          clickable v-ripple 
          @click="navigateTo('conexiones')" 
          :active="isActive('conexiones')" 
          active-class="menu-active"
        >
          <q-item-section avatar>
            <q-icon name="link" />
          </q-item-section>
          <q-item-section>Conexiones</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenedor de página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(true);
    const router = useRouter();
    const route = useRoute();

    // Función para abrir/cerrar el drawer
    const toggleDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    // Navegación a rutas
    const navigateTo = (targetRoute) => {
      router.push({ name: targetRoute });
    };

    // Resalta la pestaña activa del sidebar
    const isActive = (targetRoute) => computed(() => route.name === targetRoute);

    return {
      leftDrawerOpen,
      toggleDrawer,
      navigateTo,
      isActive,
    };
  },
};
</script>

<style scoped>
/* Clase activa para el menú seleccionado */
.menu-active {
  background-color: #e0f2f1;
  border-left: 3px solid #00796b;
}

/* Hover para los ítems del menú */
.q-item:hover {
  background-color: #f9f9f9;
  transition: background-color 0.3s;
}

/* Ajustes de cabecera y sidebar */
.q-header {
  font-size: 18px;
}

.q-item-section > .q-icon {
  color: #00796b;
}
</style>
