// Initialize the map
const map = L.map('map').setView([51.4545, -2.5879], 13); // Centered on Bristol, UK

// Add CartoDB Voyager tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Add a marker
L.marker([51.4545, -2.5879]).addTo(map)
    .bindPopup('Hello, !<br> Community spot.')
    .openPopup();

// Add the search bar with restrictions for UK only
L.Control.geocoder({
    geocoder: new L.Control.Geocoder.Nominatim({
        geocodingQueryParams: {
            countrycodes: "gb", // Restrict results to the UK
            limit: 4 // Limit to 4 suggestions
        }
    }),
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
    map.fitBounds(poly.getBounds()); // Adjust map view to fit the result
})
.addTo(map);
