const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let fireLocations = [];

// API za dodajanje požarov
app.post('/add-fire', (req, res) => {
    const { lat, lng } = req.body;
    fireLocations.push({ lat: parseFloat(lat), lng: parseFloat(lng) });
    res.json({ success: true, fireLocations });
});

// API za pridobivanje vseh požarov
app.get('/fires', (req, res) => {
    res.json(fireLocations);
});

// Zaženemo strežnik
app.listen(PORT, () => {
    console.log(`Server teče na http://localhost:${PORT}`);
});
