// Initialize the map
const map = L.map('map').setView([51.4545, -2.5879], 13); // Centered on Bristol, UK

// Add CartoDB Voyager tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Add a marker (existing functionality)
//L.marker([51.4545, -2.5879]).addTo(map)
 //   .bindPopup('Howdy default!<br> Community spot.')
 //   .openPopup();


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
            limit: 4 // Limit suggestions to 5
        }
    }),
    defaultMarkGeocode: false // Prevent default marker placement
})
.on('markgeocode', function(event) {
    const result = event.geocode;
    
    const filteredName = result.name
        .replace(/\s*,?\s*\b(?:United Kingdom|England|Scotland|Wales|Northern Ireland|GB|UK)\b\s*,?/gi, '')
        // Remove trailing administrative regions (anything after the last comma)
        .replace(/,\s*[^,]*$/i, '')
        .trim();

    console.log('Filtered Name:', filteredName);

    // Optionally add a marker or polygon with the filtered result
    const poly = L.polygon([
        result.bbox.getSouthEast(),
        result.bbox.getNorthEast(),
        result.bbox.getNorthWest(),
        result.bbox.getSouthWest()
    ]);
    
    map.fitBounds(poly.getBounds()); // Adjust map to fit the result

})
.on('geocoder_showresult', function (event) {
    const result = event.text;

    // Skip results not in the UK
    if (!/United Kingdom|England|Scotland|Wales|Northern Ireland/i.test(result)) {
        console.log('Skipped Result:', result); // Log skipped non-UK results
        return; // Prevent the result from being shown
    }
    
    console.log('UK Suggestion:', result);

    event.text = result
        .replace(/,\s*\b(?:United Kingdom|England|Scotland|Wales|Northern Ireland|GB|UK)\b/i, '') // Remove "United Kingdom"
        .replace(/\r?\n|\r/g, ' ') // Replace newlines with a space
        .replace(/\s+/g, ' ') // Collapse multiple spaces into one
        .trim();

    console.log('Filtered Suggestion:', event.text);

})

.addTo(map)


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

            // Check if latitude and longitude are valid
            if (isNaN(lat) || isNaN(lng)) {
                console.error('Invalid lat/lng:', row); // Log invalid rows
            } else {
                console.log('Valid lat/lng:', lat, lng); // Log valid lat/lng

                // Add a marker for each location
                L.marker([lat, lng], { icon: getCategoryIcon(category) })
                    .addTo(map)
                    .bindPopup(`<b>${description}</b><br>${category}`);
            }
        });
    }
});

