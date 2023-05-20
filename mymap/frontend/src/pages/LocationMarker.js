import { useEffect, useState } from 'react';
import L from "leaflet";
import {Marker, Popup} from 'react-leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
  
function LocationMarker({map}) {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    if (!map) return;

    L.easyButton("fa-map-marker", () => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });
    }).addTo(map);
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
      <Popup className='Popup1'>You are here</Popup>
    </Marker>
  )
}
  
export default LocationMarker;