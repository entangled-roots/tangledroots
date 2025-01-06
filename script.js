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

// Function to assign icons based on category
function getCategoryIcon(category) {
    if (category === 'Foraging') return foragingIcon;
    if (category === 'Growing') return growingIcon;
    return L.icon({ iconUrl: 'images/herb.png', iconSize: [25, 35] }); // Default icon
}

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
    console.log('Geocoder Results:', event.results); // Log all results

    event.results.forEach(result => {
        console.log('Raw Suggestion:', result.name); // Log each suggestion

        // Skip results not in the UK
        if (!/United Kingdom|England|Scotland|Wales|Northern Ireland|[A-Z]{1,2}\d{1,2}/i.test(result.name)) {
            console.log('Skipped Result:', result.name); // Log skipped non-UK results
            return;
        }

        console.log('UK Suggestion:', result.name);

        result.name = result.name
            .replace(/,\s*\b(?:United Kingdom|England|Scotland|Wales|Northern Ireland|GB|UK)\b/i, '') // Remove "United Kingdom"
            .replace(/\r?\n|\r/g, ' ') // Replace newlines with a space
            .replace(/\s+/g, ' ') // Collapse multiple spaces into one
            .trim();

        console.log('Filtered Suggestion:', result.name);
    });
})
.on('markgeocode', function(event) {
    const result = event.geocode;

    const filteredName = result.name
        .replace(/\s*,?\s*\b(?:United Kingdom|England|Scotland|Wales|Northern Ireland|GB|UK)\b\s*,?/gi, '')
        // Remove trailing administrative regions (anything after the last comma)
        .replace(/,\s*[^,]*$/i, '')
        .trim();

    console.log('Filtered Name:', filteredName);



    map.fitBounds(result.bbox); // Adjust map to fit the result
})
.addTo(map);

// Load data from CSV and add markers dynamically
Papa.parse('./locations_with_coords.csv', {
    download: true,
    header: true,
    complete: function(results) {
        // Log the parsed data to verify CSV content
        console.log('Parsed Data:', results.data);

        results.data.forEach(row => {
            console.log('Processing Row:', row); // Log each row to verify its content

            const lat = parseFloat(row.Latitude);
            const lng = parseFloat(row.Longitude);
            const category = row.Category;
            const description = row.Description;
            const name = row.name;
            const website = row.Website;

            // Check if latitude and longitude are valid
            if (isNaN(lat) || isNaN(lng)) {
                console.error('Invalid lat/lng:', row); // Log invalid rows
            } else {
                console.log('Valid lat/lng:', lat, lng); // Log valid lat/lng

                // Add a marker for each location
                L.marker([lat, lng], { icon: getCategoryIcon(category) })
                    .addTo(map)
                    .bindPopup(`
                        <b>${communityName}</b><br>
                        <i>${description}</i><br>
                        Category: ${category}<br>
                        <a href="${website}" target="_blank">Visit Website</a>
                    `);
            }
        });
    }
});
