import { Map, TileLayer } from 'leaflet';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { City } from '../types';

function useMap(mapRef: MutableRefObject<HTMLElement | null>, city: City): Map | undefined {
  const [map, setMap] = useState<Map>();
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, { center: city.center, zoom: city.zoom });

      const layer = new TileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      });

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }

  }, [mapRef, city]);

  return map;
}

export default useMap;
