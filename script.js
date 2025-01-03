// Initialize the map
const map = L.map('map').setView([51.4545, -2.5879], 13); // Centered on Bristol, UK

// Add CartoDB Voyager tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Add a marker (existing functionality)
L.marker([51.4545, -2.5879]).addTo(map)
    .bindPopup('Howdy !<br> Community spot.')
    .openPopup();

// Define custom icons for categories
const foragingIcon = L.icon({
    iconUrl: 'images/foraging.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const growingIcon = L.icon({
    iconUrl: 'images/growing.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const herbIcon = L.icon({
    iconUrl: 'images/herb.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Function to assign icons based on category
function getCategoryIcon(category) {
    if (category === 'Foraging') return foragingIcon;
    if (category === 'Growing') return growingIcon;
    return L.icon({ iconUrl: 'images/herb.png', iconSize: [25, 41] }); // Default icon
}

// Add the search bar
L.Control.geocoder({
    geocoder: new L.Control.Geocoder.Nominatim({
        geocodingQueryParams: {
            countrycodes: "gb", // Restrict to the UK
            limit: 4 // Limit suggestions to 5
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
    map.fitBounds(poly.getBounds()); // Adjust map to fit the result
})
.addTo(map);

// Load data from CSV and add markers dynamically
Papa.parse('roots_community_locations.csv', {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(row => {
            const lat = parseFloat(row.Latitude);
            const lng = parseFloat(row.Longitude);
            const category = row.Category;
            const description = row.Description;

            // Add a marker for each location
            L.marker([lat, lng], { icon: getCategoryIcon(category) })
                .addTo(map)
                .bindPopup(`<b>${description}</b><br>${category}`);
        });
    }
});
