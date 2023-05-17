import { useEffect, useRef } from 'react';
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { saveAs } from 'file-saver';
import 'leaflet-easybutton';

const addMarker = (feature, map, setGeojson) => {
  const markerIcon = new L.Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })
  const marker = L.marker(feature.geometry.coordinates, {
    title: "Resource Location",
    alt: "Resource Location",
    riseOnHover: true,
    draggable: true,
    icon: markerIcon
  });

  const popupContent = document.createElement('div');
  const popupTextarea = document.createElement('textarea');
  popupTextarea.className = 'marker-popup-textarea';
  popupTextarea.value = feature.properties.name || '';
  popupTextarea.onblur = () => {

    setGeojson(prevGeojson => ({
      ...prevGeojson,
      features: prevGeojson.features.map(f => {
        if (feature.properties.leaflet_id === feature.properties.leaflet_id) {
          feature.properties.name = popupTextarea.value;
        }
        return f;
      })
    }));
  };

  const btnDelete = document.createElement('button');
  btnDelete.textContent = 'Delete this marker';
  btnDelete.className = 'marker-delete-button';

  btnDelete.onclick = () => {
    const id = feature.properties.id;
    setGeojson(prevGeojson => ({
      ...prevGeojson,
      features: prevGeojson.features.filter(feature => feature.properties.id !== id),
    }));
    map.removeLayer(marker);
  };
  popupContent.append(popupTextarea);
  popupContent.append(btnDelete);

  marker.bindPopup(popupContent).openPopup();
  marker.addTo(map);
}

function AddMarker({ map, geojson, setGeojson }) {

  const HandleMapClick = (e) => {
    const geojsonFeature = {
      "type": "Feature",
      "properties": {
        leaflet_id: L.stamp(new Date())
      },
      "geometry": {
        "type": "Point",
        "coordinates": [e.latlng.lat, e.latlng.lng]
      }
    }
    const feature = geojsonFeature;
    addMarker(feature, map, setGeojson);

    const newFeatures = geojson ? [...geojson.features, geojsonFeature] : [geojsonFeature];
    setGeojson({ ...geojson, features: newFeatures });
  }

  const handleSaveClick = () => {
    const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    saveAs(blob, 'geojson.json');
  };

  useEffect(() => {
    if (!map) return;

    map.on('click', HandleMapClick);

    const button = L.easyButton('fa-globe', handleSaveClick);
    // const button1 = L.easyButton('fa-globe', openFile);

    button.addTo(map);
    // button1.addTo(map);

    return () => {
      map.off('click', HandleMapClick);
      map.removeControl(button);
    }
  }, [map, geojson, setGeojson]);

  return null;
}

export default AddMarker;
