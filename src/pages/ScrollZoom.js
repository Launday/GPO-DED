import { useEffect} from 'react';
import L from "leaflet";
  
function ScrollZoom({map, geojson}) { 
  useEffect(() => { 
    if (!map) return; 

    L.easyButton("fa-globe", () => { 
      const markers = L.geoJSON(geojson, { 
        onEachFeature: function(feature, layer) { 
          layer.bindPopup(feature.properties.name); 
        } 
      }); 
      markers.addTo(map); 
    }).addTo(map); 
  }, [map]); 
}
  
export default ScrollZoom;