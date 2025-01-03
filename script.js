// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Centered on London, UK

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Add a marker
L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('Hello, world!<br>This is a test marker.')
    .openPopup();
