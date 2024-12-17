<template>
    <q-card>
      <q-card-section>
        <div class="text-h6">Mapa de Nodos y Conexiones</div>
        <q-separator class="my-2" />
        <div class="map-container">
          <!-- Google Map -->
          <GoogleMap
            ref="mapContainer"
            api-key="AIzaSyAL9Q7uvhEzAozEmc2J5QICOg72f0Sz5QM"
            :center="center"
            :zoom="17"
            style="width: 100%; height: 500px;"
          >
            <!-- Marcadores -->
            <Marker
              v-for="nodo in nodos"
              :key="nodo.id_nodo"
              :options="{
                position: { lat: parseFloat(nodo.latitud_qr1), lng: parseFloat(nodo.longitud_qr1) },
                title: `${nodo.codigo} (ID: ${nodo.id_nodo})`,
                icon: getMarkerIcon(nodo),
              }"
              @click="selectNodo(nodo)"
            />
  
            <!-- Polilíneas -->
            <Polyline
              v-for="conexion in conexiones"
              :key="conexion.id"
              :options="{
                path: getConnectionPath(conexion),
                strokeColor: polylineOptions.strokeColor,
                strokeOpacity: polylineOptions.strokeOpacity,
                strokeWeight: polylineOptions.strokeWeight
              }"
            />
          </GoogleMap>
        </div>
      </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { GoogleMap, Marker, Polyline } from 'vue3-google-map';
  import { getNodos, getConexiones, createConexion } from '../services/api';
  import { useQuasar } from 'quasar';
  
  const $q = useQuasar();
  const center = { lat: -16.404540, lng: -71.524124 }; // Coordenadas del centro del mapa-16.404540, -71.524124

  const nodos = ref([]);
  const conexiones = ref([]);
  const selectedNodes = ref([]);
  const mapContainer = ref(null);
  
  const polylineOptions = ref({
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  
  // Fetch datos de nodos y conexiones
  const fetchData = async () => {
    try {
      const [nodosData, conexionesData] = await Promise.all([getNodos(), getConexiones()]);
      nodos.value = nodosData;
      conexiones.value = conexionesData;
  
      // Forzar el redimensionamiento del mapa
      nextTick(() => {
        if (mapContainer.value && mapContainer.value.map) {
          google.maps.event.trigger(mapContainer.value.map, 'resize');
        }
      });
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al cargar datos del mapa' });
    }
  };
  
  // Obtener la ruta entre dos nodos
  const getConnectionPath = (conexion) => {
    const origen = nodos.value.find((n) => n.id_nodo === conexion.id_nodo_origen);
    const destino = nodos.value.find((n) => n.id_nodo === conexion.id_nodo_destino);
  
    return origen && destino
      ? [
          { lat: parseFloat(origen.latitud_qr1), lng: parseFloat(origen.longitud_qr1) },
          { lat: parseFloat(destino.latitud_qr1), lng: parseFloat(destino.longitud_qr1) }
        ]
      : [];
  };
  
  // Seleccionar nodo
  const selectNodo = (nodo) => {
    try {
        console.log('Nodo seleccionado:', nodo.id_nodo, nodo);
        const message = `Nodo seleccionado: ${nodo.codigo} (ID: ${nodo.id_nodo})`;
        console.log('$q:', $q);

        if (!$q || !$q.notify) {
        console.error('$q.notify no está disponible. Verifica la configuración de Quasar.');
        return;
        }
        $q.notify({
            message: `Nodo seleccionado: ${nodo.codigo}`,
            type: 'info',
            timeout: 2000,
        });
        if (!selectedNodes.value) {
        throw new Error('selectedNodes no está definido');
        }

        if (selectedNodes.value.some((n) => n.id_nodo === nodo.id_nodo)) {
            console.warn('Este nodo ya está seleccionado.');
            $q.notify({
                message: `El nodo ${nodo.codigo} ya fue seleccionado`,
                type: 'negative',
                timeout: 2000,
            });
            return;
        }

        selectedNodes.value.push(nodo);
        console.log('Nodos seleccionados actuales:', selectedNodes.value);

        if (selectedNodes.value.length === 2) {
        const [nodo1, nodo2] = selectedNodes.value;
        console.log('Intentando crear ruta entre:', nodo1, nodo2);
        createRoute(nodo1, nodo2);
        }
    } catch (error) {
        console.error('Error en selectNodo:', error.message);
    }
    };

    const createRoute = async (nodo1, nodo2) => {
    console.log('Iniciando creación de ruta...');

    const distancia = haversineDistance(
      parseFloat(nodo1.latitud_qr1),
      parseFloat(nodo1.longitud_qr1),
      parseFloat(nodo2.latitud_qr1),
      parseFloat(nodo2.longitud_qr1)
    );
  
    try {
      const nuevaConexion = {
        id_nodo_origen: nodo1.id_nodo,
        id_nodo_destino: nodo2.id_nodo,
        distancia: distancia.toFixed(3),
      };
  
      const conexionCreada = await createConexion(nuevaConexion);
      conexiones.value.push(conexionCreada);
      $q.notify({ type: 'positive', message: `Conexión creada entre ${nodo1.codigo} y ${nodo2.codigo}` });
      resetSelection();
      fetchData();
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al crear la conexión.' });
    }
  };
  
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const resetSelection = () => {
    selectedNodes.value = [];
  };
  
  const getMarkerIcon = (nodo) => {
    return selectedNodes.value.find((n) => n.id_nodo === nodo.id_nodo)
      ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      : null;
  };
  
  onMounted(() => {
    fetchData()
    });
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 500px;
  }
  </style>
  