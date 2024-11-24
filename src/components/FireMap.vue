<template>
  <!-- Header -->
   <div class="header">
    <div class="menu-container">
      <!-- Change this part -->
      <div class="header-content">
        <div class="kebab-menu" @click="toggleMenu">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <img src="/image/firepoint-logo.png" alt="Firepoint Logo" class="logo-position" height="50">
      </div>
      <div v-if="menuVisible" class="dropdown-menu">
        <a href="/Predict">Predict</a>
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="main-content">
    <div class="sidebar">
      <h2>Seznam požarov</h2>
      <!-- Date Pickers -->
      <div class="date-picker-container">
        <div class="date-input-group">
          <label for="start-date">Začetni datum:</label> 
          <input type="date" id="start-date" v-model="startDate" />
        </div>
        <div class="date-input-group">
          <label for="end-date">Končni datum:</label>
          <input type="date" id="end-date" v-model="endDate" />
        </div>
      </div>
      
      <button @click="toggleFiresVisibility">
        {{ showFires ? 'Skrij požare' : 'Prikaži požare' }}
      </button>
      
      <ul v-if="showFires">
        <li v-for="(fire, index) in fires" :key="index">
          <div class="fire-card">
            <div class="fire-icon">🔥</div>
            <div class="fire-details">
              <div>Požar na: {{ fire.lat.toFixed(4) }}, {{ fire.lng.toFixed(4) }}</div>
              <div>Čas: {{ fire.timestamp }}</div>
              <div>Površina: {{ fire.area }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div id="map"></div>
  </div>
</template>

<script>
// Script remains exactly the same as your original
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
      fireImage: '/image/fire.jpg',
      fireIcon: null,
      fireMarkers: [],
      showFires: false,
      menuVisible: false,
      userId: null,
    };
  },
  mounted() {
    this.initMap();
    this.initFireIcon();
    this.addPredefinedFires();
    this.createGrid();
    document.addEventListener('click', this.handleClickOutside);
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([46.1512, 14.9955], 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    },
    createGrid() {
      this.gridLayer = L.featureGroup().addTo(this.map);

      const bounds = {
        north: 46.8769,
        south: 45.4214,
        east: 16.5100,
        west: 13.3750
      };

      const gridSize = 0.5;

      for (let lng = bounds.west; lng <= bounds.east; lng += gridSize) {
        L.polyline(
          [
            [bounds.south, lng],
            [bounds.north, lng]
          ],
          {
            color: '#000',
            weight: 1,
            opacity: 0.3,
            dashArray: '5, 5'
          }
        ).addTo(this.gridLayer);
      }

      for (let lat = bounds.south; lat <= bounds.north; lat += gridSize) {
        L.polyline(
          [
            [lat, bounds.west],
            [lat, bounds.east]
          ],
          {
            color: '#000',
            weight: 1,
            opacity: 0.3,
            dashArray: '5, 5'
          }
        ).addTo(this.gridLayer);
      }
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
        
        // Create custom popup content with image
        const popupContent = `
          <div class="custom-popup">
            <div>Požar na: ${fire.lat.toFixed(4)}, ${fire.lng.toFixed(4)}</div>
            <div>Čas: ${fire.timestamp}</div>
            <img src="${this.fireImage}" alt="Fire Image" style="width: 200px; height: 200px; object-fit: cover; margin-top: 10px; border-radius: 4px;">
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          maxWidth: 220,
          className: 'custom-popup'
        });
        
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

.logo-position {
  position: relative;
  left: 60px;
}

:global(.custom-popup) {
  padding: 10px;
}

:global(.custom-popup .leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:global(.custom-popup .leaflet-popup-content) {
  margin: 10px;
  min-width: 200px;
}


.header {
  background: linear-gradient(to right, #2c3e50, #3498db);
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-container {
  display: flex;
  align-items: center;
}

.kebab-menu {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px;
  height: 24px;
  justify-content: center;
 
}
.logo-position {
  margin-left: 60px;
  margin-top: 5px;
}

.kebab-menu:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dot {
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.kebab-menu:hover .dot {
  transform: scale(1.2);
}

/* Dropdown menu styles */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
  overflow: hidden;
  margin-top: 8px;
}

.dropdown-menu a {
  color: #333;
  text-decoration: none;
  padding: 12px 16px;
  display: block;
  transition: all 0.2s ease;
}

.dropdown-menu a:hover {
  background-color: #f8f9fa;
  padding-left: 20px;
}

/* Main content styles */
.main-content {
  display: flex;
  height: calc(100vh - 50px);
}

.sidebar {
  width: 25%;
  background-color: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

/* Date picker styles */
.date-picker-container {
  margin-bottom: 1.5rem;
}

.date-input-group {
  margin-bottom: 1rem;
}

.date-input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 0.9rem;
}

.date-input-group input {
  width: 90%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.date-input-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* Button styles */
.sidebar button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar button:active {
  transform: translateY(0);
}

/* Fire list styles */
.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.fire-card {
  background: white;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;
}

.fire-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fire-icon {
  font-size: 1.5rem;
}

.fire-details {
  flex: 1;
}

.fire-details div {
  margin-bottom: 4px;
  color: #495057;
  font-size: 0.9rem;
}

.fire-details div:first-child {
  color: #2c3e50;
  font-weight: 500;
}

/* Map styles */
#map {
  width: 75%;
  height: 100%;
  border-radius: 0 0 0 8px;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    margin: 3px;
    height: 40vh;
  }
  
  #map {
    width: 100%;
    height: 60vh;
  }
}
</style>