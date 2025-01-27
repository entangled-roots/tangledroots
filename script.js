// Initialize the map
const map = L.map('map').setView([51.4545, -2.5879], 13); // Centered on Bristol, UK

// Add CartoDB Voyager tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

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

const generalIcon = L.icon({
    iconUrl: 'images/magnifyingplant.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Function to assign icons based on category
function getCategoryIcon(category) {
    if (category === 'Foraging') return foragingIcon ;
    if (category === 'Growing') return growingIcon;
    if (category === 'Herbalism' ) return herbIcon;
    return L.icon({ iconUrl: 'images/magnifyingplant.png', iconSize: [25, 30] }); // Default icon
}

// Initialize an empty array to store marker data for later display
let markerDetails = [];

// Function to add a marker and store its details
function addMarker(lat, lng, category, description, communityName, website) {
    const marker = L.marker([lat, lng], { icon: getCategoryIcon(category) })
        .addTo(map)
        .bindPopup(`
            <b>${communityName}</b><br>
            <i>${description}</i><br>
            Category: ${category}<br>
            <a href="${website}" target="_blank">Visit Website</a>
        `);

    // Store marker details for later use
    markerDetails.push({ lat, lng, category, description, communityName, website, marker });

    // Update the marker info after adding a marker
    updateMarkerInfo();
}

// Update the displayed information below the map based on the visible markers within bounds
function updateMarkerInfo() {
    const bounds = map.getBounds();

    const filteredMarkers = markerDetails.filter(marker => bounds.contains([marker.lat, marker.lng]));

    // Get the container where the information will be displayed
    const container = document.getElementById('marker-info-container');
    container.innerHTML = ''; // Clear existing content

    // Display the filtered markers
    if (filteredMarkers.length > 0) {
        filteredMarkers.forEach(marker => {
            const listItem = document.createElement('div');
            listItem.style.marginBottom = '10px';
            listItem.innerHTML = `
                <b>${marker.communityName}</b><br>
                <i>${marker.description}</i><br>
                Category: ${marker.category}<br>
                <a href="${marker.website}" target="_blank">Visit Website</a>
            `;
            container.appendChild(listItem);
        });
    } else {
        container.innerHTML = '<p> No communities have been added in this area yet.</p>';
    }
}

// Attach the moveend event to update marker info when the map is moved or zoomed
map.on('moveend', function() {
    updateMarkerInfo(); // Re-filter and update marker info when the map changes
});

// Add the search bar
L.Control.geocoder({
    geocoder: new L.Control.Geocoder.Nominatim({
        geocodingQueryParams: {
            countrycodes: "gb", // Restrict suggestions to the United Kingdom
            limit: 4 // Limit suggestions
        }
    }),
    defaultMarkGeocode: false // Prevent default marker placement
})
.on('results', function (event) {
    event.results.forEach(result => {
        if (result.bbox) {
            map.fitBounds(result.bbox); // Adjust map to fit the new search result bounds
        }

        // Update the marker info after geocode
        updateMarkerInfo();
    });
})
.on('markgeocode', function(event) {
    // This event triggers when a suggestion is clicked, and it zooms to the clicked location
    const result = event.geocode;
    map.fitBounds(result.bbox); // Fit the map bounds to the clicked location

    // Update the marker info after geocode
    updateMarkerInfo();
})
.addTo(map);

// Load data from CSV and add markers dynamically
Papa.parse('./locations_with_coords.csv', {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(row => {
            const lat = parseFloat(row.Latitude);
            const lng = parseFloat(row.Longitude);
            const category = row.Category;
            const description = row.Description;
            const communityName = row.Name;
            const website = row.Website;

            // Only add valid markers to the map
            if (!isNaN(lat) && !isNaN(lng)) {
                addMarker(lat, lng, category, description, communityName, website);
            }
        });

        // Call updateMarkerInfo() to display markers after CSV loading
        updateMarkerInfo();
    }
});
