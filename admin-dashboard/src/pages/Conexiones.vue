<!-- src/pages/Conexiones.vue -->
<template>
    <q-page padding>
      <q-card>
        <q-card-section>
          <div class="flex justify-between items-center">
            <div class="text-h6">Conexiones</div>
            <q-btn color="primary" label="Crear Conexión" @click="openCreateConexionDialog" />
          </div>
          <q-separator class="my-2" />
          <ConnectionsTable />
        </q-card-section>
      </q-card>
  
      <!-- Diálogo para Crear Conexión -->
      <q-dialog v-model="showCreateConexion">
        <q-card>
          <q-card-section>
            <div class="text-h6">Crear Nueva Conexión</div>
            <q-select
              v-model="newConexion.id_nodo_origen"
              :options="nodosOptions"
              label="Nodo Origen"
              emit-value
              map-options
              required
            />
            <q-select
              v-model="newConexion.id_nodo_destino"
              :options="nodosOptions"
              label="Nodo Destino"
              emit-value
              map-options
              required
            />
            <q-input v-model="newConexion.distancia" label="Distancia (km)" type="number" required />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" @click="closeCreateConexionDialog" />
            <q-btn color="primary" label="Guardar" @click="createConexion" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import ConnectionsTable from 'components/ConnectionsTable.vue';
  import { createConexion, getNodos } from '../services/api';
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  
  export default {
    name: 'Conexiones',
    components: {
      ConnectionsTable,
    },
    setup() {
      const $q = useQuasar();
      const showCreateConexion = ref(false);
      const newConexion = ref({
        id_nodo_origen: null,
        id_nodo_destino: null,
        distancia: '',
      });
      const nodosOptions = ref([]);
  
      const openCreateConexionDialog = () => {
        showCreateConexion.value = true;
      };
  
      const closeCreateConexionDialog = () => {
        showCreateConexion.value = false;
        resetForm();
      };
  
      const resetForm = () => {
        newConexion.value = {
          id_nodo_origen: null,
          id_nodo_destino: null,
          distancia: '',
        };
      };
  
      const fetchNodos = async () => {
        try {
          const nodos = await getNodos();
          nodosOptions.value = nodos.map(nodo => ({
            label: `${nodo.codigo} (ID: ${nodo.id_nodo})`,
            value: nodo.id_nodo,
          }));
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Error al cargar nodos',
          });
        }
      };
  
      const createConexionHandler = async () => {
        // Validar que los campos requeridos no estén vacíos
        if (!newConexion.value.id_nodo_origen || !newConexion.value.id_nodo_destino || !newConexion.value.distancia) {
          $q.notify({
            type: 'warning',
            message: 'Por favor, completa todos los campos requeridos.',
          });
          return;
        }
  
        // Validar que no se esté creando una conexión duplicada o a sí misma
        if (newConexion.value.id_nodo_origen === newConexion.value.id_nodo_destino) {
          $q.notify({
            type: 'warning',
            message: 'El nodo origen y destino no pueden ser el mismo.',
          });
          return;
        }
  
        try {
          await createConexion(newConexion.value);
          $q.notify({
            type: 'positive',
            message: 'Conexión creada exitosamente',
          });
          closeCreateConexionDialog();
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Error al crear conexión',
          });
        }
      };
  
      onMounted(() => {
        fetchNodos();
      });
  
      return {
        showCreateConexion,
        newConexion,
        nodosOptions,
        openCreateConexionDialog,
        closeCreateConexionDialog,
        createConexion: createConexionHandler,
      };
    },
  };
  </script>
  