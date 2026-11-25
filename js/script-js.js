// a. Centered on Bernalillo County, NM
const map = L.map('map', {
  center: [35.0844, -106.6504],
  zoom: 10,
  zoomControl: false
});

// b. Basemap layer
const osmBasemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// c. Add zoom controls and scale bar
L.control.zoom({ position: 'topleft' }).addTo(map);
L.control.scale({ imperial: true, metric: true }).addTo(map);

// d, e, f. Load, style, and configure popups 
const federalLandGroup = L.layerGroup().addTo(map);
const primaryRoadsGroup = L.layerGroup().addTo(map);
const citiesGroup = L.layerGroup().addTo(map);

//Polygons: Federal Land 
fetch('./data/federal_land.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: "#2d6a4f",
          weight: 1.5,
          fillColor: "#52b788",
          fillOpacity: 0.45
        };
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          let popupContent = "<strong>Federal Land</strong><br>";
          for (let key in feature.properties) {
            popupContent += `${key}: ${feature.properties[key]}<br>`;
          }
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(federalLandGroup);
  })
  .catch(err => console.error("Error loading Federal Land:", err));

//Lines: Primary Roads 
fetch('./data/nm_roads_proj_FeaturesToJSO.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: "#d95f02",
          weight: 3,
          opacity: 0.85
        };
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          let popupContent = "<strong>Primary Road</strong><br>";
          for (let key in feature.properties) {
            popupContent += `${key}: ${feature.properties[key]}<br>`;
          }
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(primaryRoadsGroup);
  })
  .catch(err => console.error("Error loading Primary Roads:", err));

// Points: Cities
fetch('./data/nm_cities_proj_FeaturesToJSO.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 7,
          fillColor: "#e63946",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        });
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          let popupContent = "<strong>City</strong><br>";
          for (let key in feature.properties) {
            popupContent += `${key}: ${feature.properties[key]}<br>`;
          }
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(citiesGroup);
  })
  .catch(err => console.error("Error loading Cities:", err));

//g. Layer Control to toggle layer groups
const baseMaps = { "OpenStreetMap": osmBasemap };
const overlayMaps = {
  "Federal Land": federalLandGroup,
  "Primary Roads": primaryRoadsGroup,
  "Prominent Cities": citiesGroup
};
L.control.layers(baseMaps, overlayMaps).addTo(map);
