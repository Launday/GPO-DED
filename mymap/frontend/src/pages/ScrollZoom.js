import { useEffect} from 'react';
import L from "leaflet";
  
function ScrollZoom({map}) {

  useEffect(() => {
    if (!map) return;

    L.easyButton("fa-globe", () => 
    {
      if (map.scrollWheelZoom.enabled()) 
      {
        map.scrollWheelZoom.disable();
      }
      else 
      {
        map.scrollWheelZoom.enable();
      }
    }).addTo(map);
  }, [map]);
}
  
export default ScrollZoom;