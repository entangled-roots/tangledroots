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

// Add the search bar
L.Control.geocoder({
    defaultMarkGeocode: false // Prevent default marker placement
})
.on('markgeocode', function(event) {
    const bbox = event.geocode.bbox;
    const poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
    ]);
    map.fitBounds(poly.getBounds());
})
.addTo(map);