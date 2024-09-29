let map;
let markers = [];
let selectedNodes = [];
let nodeData = [];

// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -16.4090, lng: -71.5375 },
        zoom: 12,
    });

    // Fetch node data from the API
    fetch('http://129.159.59.70:8000/nodos/nodos')  // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
            nodeData = data;
            placeMarkers(data);
            console.log(data);
            drawConnections(); // Call to draw existing connections
        })
        .catch(error => console.error('Error fetching nodes:', error));
}

// Place markers for each node and add click listener
function placeMarkers(nodes) {
    nodes.forEach(node => {
        const position = { lat: parseFloat(node.latitud_qr1), lng: parseFloat(node.longitud_qr1) };
        const marker = new google.maps.Marker({
            position,
            map,
            title: node.codigo,
        });

        // Add click listener to select node
        marker.addListener('click', () => {
            selectNode(node, marker);
        });

        markers.push(marker);
    });
}

// Fetch and draw connections
function drawConnections() {
    fetch('http://129.159.59.70:8000/conexion/conexion/')  // Replace with your actual API endpoint for connections
        .then(response => response.json())
        .then(connections => {
            connections.forEach(connection => {
                const node1 = nodeData.find(node => node.id_nodo === connection.id_nodo_origen);
                const node2 = nodeData.find(node => node.id_nodo === connection.id_nodo_destino);

                if (node1 && node2) {
                    drawConnection(node1, node2);
                }
            });
        })
        .catch(error => console.error('Error fetching connections:', error));
}

// Draw a connection between two nodes
function drawConnection(node1, node2) {
    const start = new google.maps.LatLng(parseFloat(node1.latitud_qr1), parseFloat(node1.longitud_qr1));
    const end = new google.maps.LatLng(parseFloat(node2.latitud_qr1), parseFloat(node2.longitud_qr1));

    const routePath = new google.maps.Polyline({
        path: [start, end],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    routePath.setMap(map);
}

// Handle node selection
function selectNode(node, marker) {
    // Check if the node is already selected
    if (selectedNodes.length === 0 || (selectedNodes.length === 1 && selectedNodes[0].id_nodo !== node.id_nodo)) {
        selectedNodes.push(node);
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');  // Change marker color when selected
    }

    // When two nodes are selected, draw the route
    if (selectedNodes.length === 2) {
        drawRoute(selectedNodes[0], selectedNodes[1]);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Draw route between two selected nodes
function drawRoute(node1, node2) {
    const start = new google.maps.LatLng(parseFloat(node1.latitud_qr1), parseFloat(node1.longitud_qr1));
    const end = new google.maps.LatLng(parseFloat(node2.latitud_qr1), parseFloat(node2.longitud_qr1));

    const routePath = new google.maps.Polyline({
        path: [start, end],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    routePath.setMap(map);

    // Calcular la distancia utilizando la función haversineDistance
    const distancia = haversineDistance(
        parseFloat(node1.latitud_qr1), parseFloat(node1.longitud_qr1),
        parseFloat(node2.latitud_qr1), parseFloat(node2.longitud_qr1)
    );

    console.log('Distancia entre nodos:', distancia.toFixed(2) + ' km');

    // Enviar los nodos seleccionados al servidor
    fetch('http://129.159.59.70:8000/conexion/conexion/', { // Reemplaza con tu endpoint real
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            id_nodo_origen: node1.id_nodo,
            id_nodo_destino: node2.id_nodo,
            distancia: distancia // Agregar distancia al cuerpo de la solicitud
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Route saved:', data);
        resetSelection();  // Reiniciar la selección después de guardar la ruta
    })
    .catch(error => console.error('Error saving route:', error));
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km

    // Convertir grados a radianes
    const lat1Rad = degreesToRadians(lat1);
    const lat2Rad = degreesToRadians(lat2);
    const deltaLatRad = degreesToRadians(lat2 - lat1);
    const deltaLonRad = degreesToRadians(lon2 - lon1);

    // Fórmula de Haversine
    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distancia
    return R * c; // distancia en km
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Reset selection after drawing the route
function resetSelection() {
    selectedNodes = [];
    markers.forEach(marker => {
        marker.setIcon();  // Reset all markers to default icon
    });
}

// Load the map
window.onload = initMap;
