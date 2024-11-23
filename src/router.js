import { createRouter, createWebHistory } from 'vue-router'; // Uvozimo potrebne funkcije
import FireMap from './components/FireMap.vue'; // Komponenta, ki jo uporabljate
import Predict from './components/Predict.vue'; // Komponenta, ki jo uporabljate

// Nastavite poti
const routes = [
  { path: '/', component: FireMap },
  { path: '/predict', component: Predict },
];

// Ustvarite in izvozite instanco usmerjevalnika
const router = createRouter({
  history: createWebHistory(), // Uporabimo zgodovinski način za URL
  routes,
});

export default router;
