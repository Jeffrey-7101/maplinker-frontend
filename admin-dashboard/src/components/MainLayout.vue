<!-- src/layouts/MainLayout.vue -->
<template>
    <q-layout view="hHh lpR fFf">
      <!-- Barra Superior -->
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>
            Admin Dashboard
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <!-- Barra Lateral -->
      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <q-list>
          <q-item clickable @click="goTo('dashboard')">
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="goTo('nodos')">
            <q-item-section>
              <q-item-label>Nodos</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="goTo('conexiones')">
            <q-item-section>
              <q-item-label>Conexiones</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
  
      <!-- Contenido Principal -->
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  export default {
    name: 'MainLayout',
    data() {
      return {
        leftDrawerOpen: false,
      };
    },
    methods: {
      goTo(page) {
        this.$router.push({ name: page });
        this.leftDrawerOpen = false;
      },
    },
  };
  </script>
  