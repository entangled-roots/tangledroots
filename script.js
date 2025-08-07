
const categoryListIcons = {
  "Foraging": "images/foraging.png",
  "Growing": "images/growing.png",
  "Herbalism": "images/herb.png",
  "Conservation": "images/conservation.png",
  "General": "images/magnifyingplant.png"
};


// Initialize the map
const map = L.map('map').setView([51.4545, -2.5879], 11); // Centered on Bristol, UK

// Add a legend control to the map
// Add a legend control to the map
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const isDesktop = window.innerWidth >= 768;

    const fontSize = isDesktop ? '16px' : '14px';
    const iconSize = isDesktop ? '24px' : '18px';

    const div = L.DomUtil.create('div', 'info legend');
    div.style.background = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    div.style.fontSize = fontSize;
    div.style.zIndex = '1000';
    div.style.userSelect = 'none';
    div.style.maxWidth = isDesktop ? '100%' : '280px';

    // Apply horizontal layout styles if desktop
    if (isDesktop) {
        div.style.position = 'absolute';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.bottom = '10px';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        div.style.gap = '16px';
        div.style.flexWrap = 'wrap';
    }

    div.innerHTML = `
        ${Object.entries(categoryListIcons).map(([category, icon]) => `
            <div style="display: flex; align-items: center; gap: 6px; margin: ${isDesktop ? '0' : '8px 0'};">
                <img src="${icon}" alt="${category}" style="width: ${iconSize}; height: ${iconSize};">
                <span>${category}</span>
            </div>
        `).join('')}
    `;

    return div;
};

legend.addTo(map);

// Add toggle functionality
setTimeout(() => {
    const toggle = document.getElementById('legend-toggle');
    const content = document.getElementById('legend-content');
    const arrow = document.getElementById('legend-arrow');

    if (toggle && content && arrow) {
        toggle.addEventListener('click', () => {
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
            arrow.innerHTML = isVisible ? '&#9660;' : '&#9650;'; // ▼ or ▲
        });
    }
}, 0);



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
    iconSize: [25, 31],
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

const conservationIcon = L.icon({
    iconUrl: 'images/conservation.png', 
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
    if (category === 'Conservation' ) return conservationIcon; 
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

            // Small icon image tag — adjust width/height as needed
            const iconUrl = categoryListIcons[marker.category] || categoryListIcons["General"];

            listItem.innerHTML = `
                <b style="vertical-align: middle;">${marker.communityName}</b>
                <img src="${iconUrl}" alt="${marker.category} icon" style="width:20px; height:20px; vertical-align: middle; margin-left: 8px;">
                <br>
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
Papa.parse('locations.csv', {

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


// Make the legend draggable
function makeLegendDraggable() {
    const legendEl = document.querySelector('.custom-legend');
    if (!legendEl) return;

    let isDragging = false;
    let offsetX, offsetY;

    legendEl.addEventListener('mousedown', (e) => {
        if (!e.target.classList.contains('drag-handle')) return;

        isDragging = true;
        offsetX = e.clientX - legendEl.getBoundingClientRect().left;
        offsetY = e.clientY - legendEl.getBoundingClientRect().top;

        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        legendEl.style.position = 'absolute';
        legendEl.style.left = `${e.clientX - offsetX}px`;
        legendEl.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });
}

makeLegendDraggable();
