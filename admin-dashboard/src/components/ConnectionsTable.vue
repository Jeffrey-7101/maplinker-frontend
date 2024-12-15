<!-- src/components/ConnectionsTable.vue -->
<template>
    <q-table
      :rows="conexiones"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination.sync="pagination"
      :filter="filter"
      class="shadow-1 rounded-borders"
    >
      <template v-slot:top>
        <q-input dense debounce="300" v-model="filter" placeholder="Buscar..." />
      </template>
  
      <template v-slot:body-cell-actions="props">
        <q-btn flat color="negative" icon="delete" @click="deleteConexion(props.row.id)" />
      </template>
    </q-table>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getConexiones, deleteConexion } from '../services/api';
  import { useQuasar } from 'quasar';
  
  export default {
    name: 'ConnectionsTable',
    setup() {
      const $q = useQuasar();
      const conexiones = ref([]);
      const loading = ref(true);
      const filter = ref('');
      const pagination = ref({
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      });
  
      const columns = [
        { name: 'id', required: true, label: 'ID', align: 'left', field: 'id', sortable: true},
        { name: 'id_nodo_origen', label: 'Nodo Origen', align: 'left', field: 'id_nodo_origen', sortable: true },
        { name: 'id_nodo_destino', label: 'Nodo Destino', align: 'left', field: 'id_nodo_destino', sortable: true },
        { name: 'distancia', label: 'Distancia (km)', align: 'left', field: 'distancia', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center' },
      ];
  
      const fetchConexiones = async () => {
        loading.value = true;
        try {
          const data = await getConexiones();
          conexiones.value = data;
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Error al cargar conexiones',
          });
        } finally {
          loading.value = false;
        }
      };
  
      const deleteConexionHandler = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta conexión?')) {
          try {
            await deleteConexion(id);
            $q.notify({
              type: 'positive',
              message: 'Conexión eliminada exitosamente',
            });
            fetchConexiones();
          } catch (error) {
            $q.notify({
              type: 'negative',
              message: 'Error al eliminar conexión',
            });
          }
        }
      };
  
      onMounted(() => {
        fetchConexiones();
      });
  
      return {
        conexiones,
        loading,
        columns,
        filter,
        pagination,
        deleteConexion: deleteConexionHandler,
      };
    },
  };
  </script>
  