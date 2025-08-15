let map;
let markers = [];
let locations = [];

// Initialize Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7829, lng: -73.9654 }, // Default center (Central Park)
        zoom: 13
    });

    fetchLocations();
}

// Fetch locations from backend
async function fetchLocations() {
    try {
        const response = await fetch('http://localhost:3000/api/locations');
        locations = await response.json();
        displayLocations();
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
}

// Display locations on map and in list
function displayLocations(category = '') {
    // Clear existing markers and list
    clearMarkers();
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '';

    // Filter locations by category if specified
    const filteredLocations = category 
        ? locations.filter(loc => loc.category === category)
        : locations;

    filteredLocations.forEach(location => {
        // Add marker to map
        const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.name
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <h3>${location.name}</h3>
                <p>${location.description}</p>
                <p>${location.address}</p>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);

        // Add to list
        const locationElement = document.createElement('div');
        locationElement.className = 'p-4 border rounded hover:bg-gray-50 cursor-pointer';
        locationElement.innerHTML = `
            <h3 class="font-bold">${location.name}</h3>
            <p class="text-sm text-gray-600">${location.category}</p>
        `;

        locationElement.addEventListener('click', () => {
            map.setCenter({ lat: location.latitude, lng: location.longitude });
            map.setZoom(15);
            infoWindow.open(map, marker);
        });

        locationList.appendChild(locationElement);
    });
}

// Clear all markers from map
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Handle category filter
document.getElementById('category-filter').addEventListener('change', (e) => {
    displayLocations(e.target.value);
});

// Handle form submission
document.getElementById('add-location-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newLocation = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        description: document.getElementById('description').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLocation)
        });

        if (response.ok) {
            fetchLocations();
            e.target.reset();
        }
    } catch (error) {
        console.error('Error adding location:', error);
    }
});

// Initialize map when page loads
window.onload = initMap;