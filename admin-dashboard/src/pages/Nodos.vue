<!-- src/pages/Nodos.vue -->
<template>
    <q-page padding>
      <q-card>
        <q-card-section>
          <div class="flex justify-between items-center">
            <div class="text-h6">Nodos</div>
            <q-btn color="primary" label="Crear Nodo" @click="openCreateNodoDialog" />
          </div>
          <q-separator class="my-2" />
          <NodesTable />
        </q-card-section>
      </q-card>
  
      <!-- Diálogo para Crear Nodo -->
      <q-dialog v-model="showCreateNodo">
        <q-card>
          <q-card-section>
            <div class="text-h6">Crear Nuevo Nodo</div>
            <q-input v-model="newNodo.codigo" label="Código" required />
            <q-input v-model="newNodo.latitud_qr1" label="Latitud QR1" type="number" required />
            <q-input v-model="newNodo.longitud_qr1" label="Longitud QR1" type="number" required />
            <q-input v-model="newNodo.latitud_qr2" label="Latitud QR2" type="number" required />
            <q-input v-model="newNodo.longitud_qr2" label="Longitud QR2" type="number" required />
            <q-input v-model="newNodo.altitud" label="Altitud" type="number" required />
            <q-input v-model="newNodo.descripcion" label="Descripción" type="textarea" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" @click="closeCreateNodoDialog" />
            <q-btn color="primary" label="Guardar" @click="createNodo" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import NodesTable from 'components/NodesTable.vue';
  import { createNodo } from '../services/api';
  import { ref } from 'vue';
  import { useQuasar } from 'quasar';
  
  export default {
    name: 'Nodos',
    components: {
      NodesTable,
    },
    setup() {
      const $q = useQuasar();
      const showCreateNodo = ref(false);
      const newNodo = ref({
        codigo: '',
        latitud_qr1: '',
        longitud_qr1: '',
        latitud_qr2: '',
        longitud_qr2: '',
        altitud: '',
        descripcion: '',
      });
  
      const openCreateNodoDialog = () => {
        showCreateNodo.value = true;
      };
  
      const closeCreateNodoDialog = () => {
        showCreateNodo.value = false;
        resetForm();
      };
  
      const resetForm = () => {
        newNodo.value = {
          codigo: '',
          latitud_qr1: '',
          longitud_qr1: '',
          latitud_qr2: '',
          longitud_qr2: '',
          altitud: '',
          descripcion: '',
        };
      };
  
      const createNodoHandler = async () => {
        // Validar que los campos requeridos no estén vacíos
        if (
          !newNodo.value.codigo ||
          !newNodo.value.latitud_qr1 ||
          !newNodo.value.longitud_qr1 ||
          !newNodo.value.latitud_qr2 ||
          !newNodo.value.longitud_qr2 ||
          !newNodo.value.altitud
        ) {
          $q.notify({
            type: 'warning',
            message: 'Por favor, completa todos los campos requeridos.',
          });
          return;
        }
  
        try {
          await createNodo(newNodo.value);
          $q.notify({
            type: 'positive',
            message: 'Nodo creado exitosamente',
          });
          closeCreateNodoDialog();
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Error al crear nodo',
          });
        }
      };
  
      return {
        showCreateNodo,
        newNodo,
        openCreateNodoDialog,
        closeCreateNodoDialog,
        createNodo: createNodoHandler,
      };
    },
  };
  </script>
  