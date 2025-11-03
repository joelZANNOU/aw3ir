// --- Géolocalisation et affichage de la carte ---
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      "❌ La géolocalisation n’est pas supportée par ce navigateur.";
  }
}

// Si l'utilisateur autorise la géolocalisation
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Remplir le champ adresse
  document.getElementById("address").value = `${lat},${lon}`;

  // Créer la carte OpenStreetMap
  const zoom = 14;
  const delta = 0.02 / Math.pow(2, zoom - 10);
  const bboxEdges = {
    south: lat - delta,
    north: lat + delta,
    west: lon - delta,
    east: lon + delta,
  };

  const bbox = `${bboxEdges.west}%2C${bboxEdges.south}%2C${bboxEdges.east}%2C${bboxEdges.north}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  document.getElementById("map").innerHTML = `
    <iframe
      width="100%"
      height="250"
      frameborder="0"
      scrolling="no"
      src="${iframeSrc}">
    </iframe>
  `;
}

// Gestion des erreurs
function showError(error) {
  const mapDiv = document.querySelector("#map");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      mapDiv.innerHTML = "❌ Autorisation refusée pour la géolocalisation.";
      break;
    case error.POSITION_UNAVAILABLE:
      mapDiv.innerHTML =
        "⚠️ Les informations de localisation sont indisponibles.";
      break;
    case error.TIMEOUT:
      mapDiv.innerHTML = "⏳ La requête a expiré.";
      break;
    default:
      mapDiv.innerHTML = "❌ Une erreur inconnue est survenue.";
  }
}
