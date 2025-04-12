import { useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { Icon, Marker, layerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import useMap from '../hooks/useMap';
import { Paths } from '../enums/paths';
import { CityPlace } from '../types';

import IconPoint from '../../public/img/pin.svg';
import IconPointActive from '../../public/img/pin-active.svg';
import { useTypedActions } from '../hooks/useTypedActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useScrollTo from '../hooks/useScrollTo';

type MapProps = {
  points: CityPlace[];
  id?: string;
};

export default function Map({ points, id }: MapProps) {
  const { pathname } = useLocation() as { pathname: Paths };
  const isMain = pathname === Paths.Main;
  const isOffer = pathname === (Paths.Offer.replace(':id', String(id)) as Paths);
  const { city: activeCity } = points[0];
  const { setActivePointPlace } = useTypedActions();
  const activePointPlace = useTypedSelector((state: { app: { activePointPlace: CityPlace } }) => state.app.activePointPlace);
  const { scrollToElement } = useScrollTo();

  const mapRef = useRef(null);
  const map = useMap(mapRef, activeCity.location);
  const activePointRef = useRef<Marker>();

  const handlePointClick = useCallback(
    (clickedMarker: Marker) => {
      if (activePointRef.current && activePointRef.current !== clickedMarker) {
        activePointRef.current.setIcon(
          new Icon({
            iconUrl: IconPoint,
            iconSize: [32, 50],
            iconAnchor: [20, 50],
          }),
        );
      }

      clickedMarker.setIcon(
        new Icon({
          iconUrl: IconPointActive,
        }),
      );

      activePointRef.current = clickedMarker;

      const clickedLatitude = clickedMarker.getLatLng().lat;
      const currentPointPlace = points.find((point: CityPlace) => point.location.latitude === clickedLatitude) as CityPlace;
      setActivePointPlace(currentPointPlace);
      scrollToElement(currentPointPlace.id);
    },
    [points, setActivePointPlace, scrollToElement],
  );

  useEffect(() => {
    if (map && points) {
      const layer = layerGroup();
      points.forEach((point: CityPlace) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude,
        });

        let iconUrl = IconPoint;
        if (point.id === activePointPlace?.id) {
          iconUrl = IconPointActive;
        }

        marker.setIcon(
          new Icon({
            iconUrl,
            iconSize: [32, 50],
            iconAnchor: [20, 50],
          }),
        );
        marker.on('click', () => handlePointClick(marker));
        layer.addLayer(marker);
      });
      map.addLayer(layer);
    }
  }, [map, handlePointClick, points, activePointPlace]);

  return <section ref={mapRef} className={`map ${isMain ? 'cities__map' : ''} ${isOffer ? 'offer__map' : ''}`}></section>;
}
