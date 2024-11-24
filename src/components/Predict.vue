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

    <!-- Main content -->
    <div class="main-content">
      <div class="sidebar">
        <h2>Seznam požarov</h2>
        
        <!-- Date Pickers -->
        <div class="date-picker-container">
          <div class="input-group">
            <label for="start-date">Začetni datum:</label> 
            <input type="date" id="start-date" v-model="startDate" />
          </div>
          <div class="input-group">
            <label for="end-date">Končni datum:</label>
            <input type="date" id="end-date" v-model="endDate" />
          </div>
        </div>

        <button @click="toggleFiresVisibility">
          {{ showFires ? "Skrij požare" : "Prikaži požare" }}
        </button>

        <ul v-if="showFires">
          <li v-for="(fire, index) in fires" :key="index" class="fire-card">
            <div class="fire-header">
              <div class="fire-icon">🔥</div>
              <div class="probability-badge">
                {{ fire.probability }}
              </div>
            </div>
            
            <div class="fire-details">
              <div class="detail-group">
                <span class="label">Lokacija:</span>
                <span>{{ fire.lat.toFixed(4) }}, {{ fire.lng.toFixed(4) }}</span>
              </div>
              <div class="detail-group">
                <span class="label">Čas:</span>
                <span>{{ fire.timestamp }}</span>
              </div>
              
              <div class="metrics-grid">
                <div class="metric">
                  <span class="label">ISI</span>
                  <span class="value">{{ fire.features.ISI }}</span>
                </div>
                <div class="metric">
                  <span class="label">RH</span>
                  <span class="value">{{ fire.features.RH }}%</span>
                </div>
                <div class="metric">
                  <span class="label">Dež</span>
                  <span class="value">{{ fire.features.Rain }} mm</span>
                </div>
                <div class="metric">
                  <span class="label">Temperatura</span>
                  <span class="value">{{ fire.features.Temperature }}°C</span>
                </div>
                <div class="metric">
                  <span class="label">Hitrost vetra</span>
                  <span class="value">{{ fire.features.Ws }} m/s</span>
                </div>
              </div>

              <div class="prediction-section">
                <span class="label">Napoved:</span>
                <span class="prediction-value">{{ fire.prediction }}%</span>
              </div>
            </div>
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
<<<<<<< HEAD
        {
          lat: 46.1511,
          lng: 14.5551,
          timestamp: "2024-11-23 09:00",
          probability: 85, // Probability in %
          features: {
            ISI: 27.865,
            RH: 83.0,
            Rain: 0.0,
            Temperature: 4.6,
            Ws: 6.17,
          },
          prediction: 85,
        },
        // Mock more fire data here
      ],
      gridData: [], // Holds grid probabilities (mock data)
      gridLayer: null,
=======
  {
    lat: 46.1511,
    lng: 14.5551,
    timestamp: "2024-11-23 09:00",
    probability: "Domzale",
    features: {
      ISI: 27.865,
      RH: 83.0,
      Rain: 0.0,
      Temperature: 4.6,
      Ws: 6.17,
    },
    prediction: 13.5,
  },
  {
    lat: 45.6902,
    lng: 14.3568,
    timestamp: "2024-11-23 10:30",
    probability: "Cerknica",
    features: {
      ISI: 15.432,
      RH: 70.5,
      Rain: 0.2,
      Temperature: 5.1,
      Ws: 4.92,
    },
    prediction: 6.8,
  },
  {
    lat: 46.0,
    lng: 15.2183,
    timestamp: "2024-11-23 11:00",
    probability: "Sevnica",
    features: {
      ISI: 33.124,
      RH: 60.0,
      Rain: 0.0,
      Temperature: 6.8,
      Ws: 7.45,
    },
    prediction: 15.2,
  },
],
      fireIcon: null,
      fireMarkers: [],
      showFires: false,
      menuVisible: false,
>>>>>>> 2979ca65bc835fb7e747389b56ba4e094245350e
    };
  },
  mounted() {
    this.initMap();
    this.initFireIcon();
    this.addPredefinedFires();
<<<<<<< HEAD
    this.generateGridData(); // Mock grid data
    this.drawGrid(); // Draw the grid
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([46.1512, 14.9955], 8); // Slovenia
=======
    this.createGrid();
    document.addEventListener("click", this.handleClickOutside);
  },
  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    initMap() {
      // Uporaba prejšnje mape z enakimi začetnimi parametri
      this.map = L.map("map").setView([46.1512, 14.9955], 9); // Osrednja Slovenija
>>>>>>> 2979ca65bc835fb7e747389b56ba4e094245350e
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);
    },
    createGrid() {
      this.gridLayer = L.featureGroup().addTo(this.map);

      // Define the bounds for Slovenia (approximate)
      const bounds = {
        north: 46.8769,
        south: 45.4214,
        east: 16.5100,
        west: 13.3750
      };

      // Create grid lines
      const gridSize = 0.5; // Grid size in degrees
      
      // Draw vertical lines
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

      // Draw horizontal lines
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
      this.fires.forEach((fire) => {
        const marker = L.marker([fire.lat, fire.lng], { icon: this.fireIcon }).addTo(this.map);
        marker.bindPopup(
            `<strong>Lokacija:</strong> ${fire.lat.toFixed(4)}, ${fire.lng.toFixed(4)}<br>
           <strong>Verjetnost:</strong> ${fire.probability}%`
        );
      });
    },
    generateGridData() {
      // Mock grid data: 5x5 grid with random fire probabilities (0-100)
      this.gridData = Array.from({ length: 5 }, () =>
          Array.from({ length: 5 }, () => Math.random() * 100)
      );
    },
   drawGrid() {
  if (this.gridLayer) this.gridLayer.clearLayers();

  // Meje območja Slovenije
  const bounds = {
    south: 45.42, // najjužnejša točka
    north: 46.88, // najsevernejša točka
    west: 13.37,  // najbolj zahodna točka
    east: 16.6,   // najbolj vzhodna točka
  };

  const rows = 20; // Število vrstic
  const cols = 20; // Število stolpcev

  const latSpan = (bounds.north - bounds.south) / rows; // Višina ene celice
  const lngSpan = (bounds.east - bounds.west) / cols; // Širina ene celice

  this.gridLayer = L.layerGroup();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const lat = bounds.south + i * latSpan; // Zgornji levi kot celice
      const lng = bounds.west + j * lngSpan; // Zgornji levi kot celice

      const probability = Math.random() * 100; // Generiraj naključno verjetnost
      const color = `rgba(255, 0, 0, ${probability / 100})`; // Barva na podlagi verjetnosti

      // Ustvarimo kvadrat z ustrezno velikostjo in brez obrobe
      const square = L.rectangle(
        [
          [lat, lng], // Zgornji levi kot
          [lat + latSpan, lng + lngSpan], // Spodnji desni kot
        ],
        {
          fillColor: color, // Barva ozadja kvadrata
          fillOpacity: 0.6, // Prosojnost
          weight: 0, // Debelina obrobe nastavljena na 0
        }
      );

      square.bindPopup(`Verjetnost požara: ${probability.toFixed(1)}%`);
      this.gridLayer.addLayer(square);
    }
  }

  this.gridLayer.addTo(this.map);
},


  },
};

</script>

<style scoped>
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
<<<<<<< HEAD
}

.grid-square {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 0; /* Odstranjena za boljše stikanje */
  transition: background-color 0.3s ease, opacity 0.3s ease;
=======
>>>>>>> 2979ca65bc835fb7e747389b56ba4e094245350e
}

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
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: background-color 0.3s ease;
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

.date-picker-container {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 0.9rem;
}

.input-group input {
  width: 90%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

button {
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

button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fire-card {
  background: white;
  margin: 10px 0;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.fire-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

<<<<<<< HEAD
.fire-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.fire-icon {
  font-size: 1.5rem;
}

=======
>>>>>>> 2979ca65bc835fb7e747389b56ba4e094245350e
.probability-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
}

.high-probability {
  background-color: #ff5252;
  color: white;
}

.medium-probability {
  background-color: #ffb142;
  color: white;
}

.low-probability {
  background-color: #20bf6b;
  color: white;
}

.fire-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

<<<<<<< HEAD
=======
.logo-container {
  padding: 8px 16px;
}

.logo {
  height: 40px;
  width: auto;
}

>>>>>>> 2979ca65bc835fb7e747389b56ba4e094245350e
.detail-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 8px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.label {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
}

.value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.prediction-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 8px;
  background-color: #e9ecef;
  border-radius: 6px;
}

.prediction-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

#map {
  width: 75%;
  height: 100%;
  border-radius: 0 0 0 8px;
  overflow: hidden;
<<<<<<< HEAD
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: 40vh;
  }
  
  #map {
    width: 100%;
    height: 60vh;
  }
=======
>>>>>>> 2979ca65bc835fb7e747389b56ba4e094245350e
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: 40vh;
  }
  
  #map {
    width: 100%;
    height: 60vh;
  }
}
</style>