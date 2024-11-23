<template>
  <!-- Header -->
   <div class="header">
    <div class="menu-container">
      <div class="kebab-menu" @click="toggleMenu">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div v-if="menuVisible" class="dropdown-menu">
       <a href="/Predict">Predict</a>
        
        
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
        <br><br><button @click="toggleFiresVisibility">{{ showFires ? 'Skrij požare' : 'Prikaži požare' }}</button>
      <ul v-if="showFires">
  <li v-for="(fire, index) in fires" :key="index">
    Požar na: {{ fire.lat.toFixed(4) }}, {{ fire.lng.toFixed(4) }} <br />
    Čas: {{ fire.timestamp }} <br />
    Površina: {{ fire.area }}
  </li>
</ul>
    </div>

    <div id="map"></div>
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
        { lat: 46.0511, lng: 14.5051, timestamp: '2024-11-23 09:00', area: '7m²' },
      { lat: 45.8902, lng: 14.4568, timestamp: '2024-11-23 10:30', area: '3m²' },
      { lat: 46.1512, lng: 15.2189, timestamp: '2024-11-23 11:00', area: '2m²' }
      ],
      fireIcon: null,
      fireMarkers: [],
      showFires: false,
      menuVisible: false,
      userId: null, // Add userId state, you can set this based on your auth logic
    };
  },
  mounted() {
    this.initMap();
    this.initFireIcon();
    this.addPredefinedFires();
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([46.1512, 14.9955], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
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
      this.fires.forEach(fire => {
        const marker = L.marker([fire.lat, fire.lng], { icon: this.fireIcon }).addTo(this.map);
        marker.bindPopup(`Požar na: ${fire.lat.toFixed(4)}, ${fire.lng.toFixed(4)}<br>Čas: ${fire.timestamp}`).openPopup();
        this.fireMarkers.push(marker);
      });
    },
    toggleFiresVisibility() {
      this.showFires = !this.showFires;
      this.fireMarkers.forEach(marker => {
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
      const menu = document.querySelector('.menu-container');
      if (menu && !menu.contains(event.target)) {
        this.menuVisible = false;
      }
    }
  },
};
</script>

<style scoped>
/* Header styles */
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

/* Kebab menu styles */
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

/* Dropdown menu styles */
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

.logout-link {
  color: #ff5555 !important;
  border-top: 1px solid #eee;
}

.login-link {
  color: #4CAF50 !important;
  border-top: 1px solid #eee;
}

/* Main content styles */
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