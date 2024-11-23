import { createApp } from 'vue'; // Uvozimo Vue funkcijo za ustvarjanje aplikacije
import App from './App.vue'; // Glavna komponenta aplikacije
import router from './router'; // Uvozimo nastavitve usmerjevalnika

// Ustvarimo aplikacijo in dodamo router
createApp(App)
  .use(router) // Dodamo usmerjevalnik
  .mount('#app'); // Montiramo aplikacijo
