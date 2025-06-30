import { Icon, Marker, layerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Paths } from '../enums/paths';
import useMap from '../hooks/useMap';
import { Place } from '../types';

import useScrollTo from '../hooks/useScrollTo';
import { useTypedActions } from '../hooks/useTypedActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import IconPointActive from '/img/pin-active.svg';
import IconPoint from '/img/pin.svg';
import { selectActivePointPlace } from '../store/selectors';

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

// Предзагрузка иконок для предотвращения проблем с отображением
try {
  new Image().src = IconPoint;
  new Image().src = IconPointActive;
} catch (error) {
  // console.warn('Ошибка при загрузке иконок карты:', error);
}

function Map({ points, id, city }: MapProps) {
  const { scrollToElement } = useScrollTo();
  const { pathname } = useLocation() as { pathname: Paths };
  const isOffer = pathname === (Paths.Offer.replace(':city', String(city)).replace(':id', String(id)) as Paths);
  const { setActivePointPlace } = useTypedActions();
  const activePointPlace = useTypedSelector(selectActivePointPlace);

  const mapRef = useRef<HTMLDivElement>(null);
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
    if (!map || !Array.isArray(points) || points.length === 0) {
      return;
    }

    // Удаление существующих маркеров
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }
    markersRef.current = [];

    const layer = layerGroup();
    markersLayerRef.current = layer;

    points.forEach((point) => {
      if (!point?.location?.latitude || !point?.location?.longitude) {
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
      if (markersLayerRef.current) {
        map.removeLayer(markersLayerRef.current);
      }
    };
  }, [map, points, activePointPlace?.id, id, handlePointClick]);

  return <section ref={mapRef} className={`map ${isOffer ? 'offer__map' : 'cities__map'}`}></section>;
}

export default memo(Map);
