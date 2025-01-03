// Initialize the map
const map = L.map('map').setView([51.4545, -2.5879], 13); // Centered on London, UK



L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);
// Add OpenStreetMap tiles
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//    maxZoom: 19
//}).addTo(map);

// Add a marker
L.marker([51.4545, -2.5879]).addTo(map)
    .bindPopup('Hello, holly!<br>This is practice.')
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
