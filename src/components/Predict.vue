<template>
  <div>
    <!-- Header -->
    <div class="header">
      <div class="menu-container">
        <div class="kebab-menu" @click="toggleMenu">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div v-if="menuVisible" class="dropdown-menu">
          <a href="/">Požari</a>
        </div>
      </div>
    </div>

    <!-- Glavni vsebinski del -->
    <div class="main-content">
      <div class="sidebar">
        <h2>Seznam požarov</h2>
        <!-- Date Pickers -->
  <label for="start-date">Začetni datum:</label> 
  <input type="date" id="start-date" v-model="startDate" />
<br>
  <label for="end-date">Končni datum:</label>
  <input type="date" id="end-date" v-model="endDate" />
        <br><br><button @click="toggleFiresVisibility">
          {{ showFires ? "Skrij požare" : "Prikaži požare" }}
        </button>
        <ul v-if="showFires">
  <li v-for="(fire, index) in fires" :key="index">
    <strong>Lokacija:</strong> {{ fire.lat.toFixed(4) }}, {{ fire.lng.toFixed(4) }} <br />
    <strong>Čas:</strong> {{ fire.timestamp }} <br />
    <strong>Verjetnost:</strong> {{ fire.probability }}% <br />
    <strong>ISI:</strong> {{ fire.features.ISI }} <br />
    <strong>RH:</strong> {{ fire.features.RH }}% <br />
    <strong>Dež:</strong> {{ fire.features.Rain }} mm <br />
    <strong>Temperatura:</strong> {{ fire.features.Temperature }}°C <br />
    <strong>Hitrost vetra:</strong> {{ fire.features.Ws }} m/s <br />
    <strong>Napoved:</strong> {{ fire.prediction }}
  </li>
</ul>

      </div>

      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import fireIconUrl from "@/assets/fire-icon.png";

export default {
  name: "FireMap",
  data() {
    return {
      map: null,
      fires: [
  {
    lat: 46.1511,
    lng: 14.5551,
    timestamp: "2024-11-23 09:00",
    probability: 4,
    features: {
      ISI: 27.865,
      RH: 83.0,
      Rain: 0.0,
      Temperature: 4.6,
      Ws: 6.17,
    },
    prediction: 4.5,
  },
  {
    lat: 45.6902,
    lng: 14.3568,
    timestamp: "2024-11-23 10:30",
    probability: 65,
    features: {
      ISI: 15.432,
      RH: 70.5,
      Rain: 0.2,
      Temperature: 5.1,
      Ws: 4.92,
    },
    prediction: 3.8,
  },
  {
    lat: 46.0,
    lng: 15.2183,
    timestamp: "2024-11-23 11:00",
    probability: 90,
    features: {
      ISI: 33.124,
      RH: 60.0,
      Rain: 0.0,
      Temperature: 6.8,
      Ws: 7.45,
    },
    prediction: 5.2,
  },
],
      fireIcon: null,
      fireMarkers: [],
      showFires: false,
      menuVisible: false,
    };
  },
  mounted() {
    this.initMap();
    this.initFireIcon();
    this.addPredefinedFires();
    document.addEventListener("click", this.handleClickOutside);
  },
  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    initMap() {
      // Uporaba prejšnje mape z enakimi začetnimi parametri
      this.map = L.map("map").setView([46.1512, 14.9955], 8); // Osrednja Slovenija
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);
    },
    initFireIcon() {
      this.fireIcon = L.icon({
        iconUrl: fireIconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    },
    addPredefinedFires() {
      this.fires.forEach((fire) => {
        const marker = L.marker([fire.lat, fire.lng], { icon: this.fireIcon }).addTo(this.map);
        marker.bindPopup(
          `<strong>Lokacija:</strong> ${fire.lat.toFixed(4)}, ${fire.lng.toFixed(4)}<br>
           <strong>Verjetnost:</strong> ${fire.probability}%`
        );
        this.fireMarkers.push(marker);
      });
    },
    toggleFiresVisibility() {
      this.showFires = !this.showFires;
      this.fireMarkers.forEach((marker) => {
        if (this.showFires) {
          marker.addTo(this.map);
        } else {
          marker.removeFrom(this.map);
        }
      });
    },
    toggleMenu(event) {
      event.stopPropagation();
      this.menuVisible = !this.menuVisible;
    },
    handleClickOutside(event) {
      const menu = document.querySelector(".menu-container");
      if (menu && !menu.contains(event.target)) {
        this.menuVisible = false;
      }
    },
  },
};
</script>

<style scoped>
/* Header */
.header {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 50px;
}

/* Kebab menu */
.menu-container {
  position: relative;
}

.kebab-menu {
  cursor: pointer;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-menu a {
  color: #333;
  text-decoration: none;
  padding: 12px 16px;
  display: block;
  transition: background-color 0.2s;
}

.dropdown-menu a:hover {
  background-color: #f5f5f5;
}

/* Main content */
.main-content {
  display: flex;
  height: calc(100vh - 50px);
}

.sidebar {
  width: 25%;
  background-color: #f4f4f4;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-top: 0;
}

.sidebar button {
  background-color: #ff8888;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 5px;
}

.sidebar button:hover {
  background-color: #ff5555;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
  padding: 10px;
  background: #ffe0e0;
  border: 1px solid #ff8888;
  border-radius: 5px;
}

#map {
  width: 75%;
  height: 100%;
}
</style>
