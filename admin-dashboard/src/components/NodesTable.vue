<!-- src/components/NodesTable.vue -->
<template>
    <q-table
      :rows="nodos"
      :columns="columns"
      row-key="id_nodo"
      :loading="loading"
      :pagination.sync="pagination"
      :filter="filter"
      class="shadow-1 rounded-borders"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Buscar..." />
      </template>
  
      <template v-slot:body-cell-actions="props">
        <q-btn flat color="negative" icon="delete" @click="deleteNodo(props.row.id_nodo)" />
      </template>
    </q-table>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getNodos, deleteNodo } from '../services/api';
  import { useQuasar } from 'quasar';
  
  export default {
    name: 'NodesTable',
    setup() {
      const $q = useQuasar();
      const nodos = ref([]);
      const loading = ref(true);
      const filter = ref('');
      const pagination = ref({
        page: 1,
        rowsPerPage: 10,
      });
  
      const columns = [
        { name: 'id_nodo', required: true, label: 'ID', align: 'left', field: 'id_nodo', sortable: true },
        { name: 'codigo', required: true, label: 'Código', align: 'left', field: 'codigo', sortable: true },
        { name: 'latitud_qr1', label: 'Latitud QR1', align: 'left', field: 'latitud_qr1', sortable: true },
        { name: 'longitud_qr1', label: 'Longitud QR1', align: 'left', field: 'longitud_qr1', sortable: true },
        { name: 'latitud_qr2', label: 'Latitud QR2', align: 'left', field: 'latitud_qr2', sortable: true },
        { name: 'longitud_qr2', label: 'Longitud QR2', align: 'left', field: 'longitud_qr2', sortable: true },
        { name: 'altitud', label: 'Altitud', align: 'left', field: 'altitud', sortable: true },
        { name: 'descripcion', label: 'Descripción', align: 'left', field: 'decripcion', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center' },
      ];
  
      const fetchNodos = async () => {
        loading.value = true;
        try {
          const data = await getNodos();
          nodos.value = data;
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Error al cargar nodos',
          });
        } finally {
          loading.value = false;
        }
      };
  
      const deleteNodoHandler = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este nodo?')) {
          try {
            await deleteNodo(id);
            $q.notify({
              type: 'positive',
              message: 'Nodo eliminado exitosamente',
            });
            fetchNodos();
          } catch (error) {
            $q.notify({
              type: 'negative',
              message: 'Error al eliminar nodo',
            });
          }
        }
      };
  
      onMounted(() => {
        fetchNodos();
      });
  
      return {
        nodos,
        loading,
        columns,
        filter,
        pagination,
        deleteNodo: deleteNodoHandler,
      };
    },
  };
  </script>
  