// src/boot/google-maps.js
import { boot } from 'quasar/wrappers';
import VueGoogleMaps from 'vue3-google-map';

export default boot(({ app }) => {
  app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAL9Q7uvhEzAozEmc2J5QICOg72f0Sz5QM', // Reemplaza con tu API Key
    //   libraries: 'places', // Puedes añadir más bibliotecas si es necesario
      language: "es",
      region: "PE",
        async:true,
        defer:true,
    },
  });
});
