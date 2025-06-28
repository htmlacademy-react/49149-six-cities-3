import { useLocation } from 'react-router-dom';
import { memo, useCallback, useEffect, useRef } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import useMap from '../hooks/useMap';
import { Paths } from '../enums/paths';
import { Place } from '../types';

import IconPoint from '../../public/img/pin.svg';
import IconPointActive from '../../public/img/pin-active.svg';
import { useTypedActions } from '../hooks/useTypedActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useScrollTo from '../hooks/useScrollTo';

type MapProps = {
  points: Place[];
  id?: string;
  city: string;
};

const defaultIcon = new Icon({
  iconUrl: IconPoint,
  iconSize: [32, 50],
  iconAnchor: [20, 50],
});

const activeIcon = new Icon({
  iconUrl: IconPointActive,
  iconSize: [32, 50],
  iconAnchor: [20, 50],
});

new Image().src = IconPoint;
new Image().src = IconPointActive;

function Map({ points, id, city }: MapProps) {
  const { scrollToElement } = useScrollTo();
  const { pathname } = useLocation() as { pathname: Paths };
  const isOffer = pathname === (Paths.Offer.replace(':city', String(city)).replace(':id', String(id)) as Paths);
  const { setActivePointPlace } = useTypedActions();
  const activePointPlace = useTypedSelector((state) => state.app.activePointPlace);

  const mapRef = useRef(null);
  const markersLayerRef = useRef<ReturnType<typeof layerGroup>>();
  const map = useMap(mapRef, points);
  const markersRef = useRef<Marker[]>([]);

  const handlePointClick = useCallback(
    (point: Place) => {
      setActivePointPlace(point);
      scrollToElement(point.id);
    },
    [setActivePointPlace, scrollToElement],
  );

  useEffect(() => {
    if (!map || !Array.isArray(points)) {
      return;
    }

    // Удаление маркеров
    markersRef.current.forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    const layer = layerGroup();
    markersLayerRef.current = layer;

    points.forEach((point) => {
      if (!point?.location) {
        return;
      }

      const marker = new Marker([point.location.latitude, point.location.longitude], {
        icon: point.id === activePointPlace?.id || point.id === id ? activeIcon : defaultIcon,
      });

      marker.on('click', () => handlePointClick(point));
      layer.addLayer(marker);
      markersRef.current.push(marker);
    });

    map.addLayer(layer);

    return () => {
      layer.remove();
    };
  }, [map, points, activePointPlace?.id, id, handlePointClick]);

  return <section ref={mapRef} className={`map ${isOffer ? 'offer__map' : 'cities__map'}`}></section>;
}

export default memo(Map);
