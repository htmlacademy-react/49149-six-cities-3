import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
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
};

export default function Map({ points, id }: MapProps) {
  const { city } = useParams();
  const { scrollToElement } = useScrollTo();
  const { pathname } = useLocation() as { pathname: Paths };

  const isOffer = pathname === (Paths.Offer.replace(':city', String(city)).replace(':id', String(id)) as Paths);

  const { setActivePointPlace } = useTypedActions();
  const activePointPlace = useTypedSelector((state: { app: { activePointPlace: Place } }) => state.app.activePointPlace);

  const mapRef = useRef(null);
  const activePointRef = useRef<Marker>();
  const map = useMap(mapRef, points);

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
      const clickedLongitude = clickedMarker.getLatLng().lng;
      const currentPointPlace = points.find((point: Place) => point.location.latitude === clickedLatitude && point.location.longitude === clickedLongitude) as Place;
      setActivePointPlace(currentPointPlace);
      scrollToElement(currentPointPlace.id);
    },
    [points, scrollToElement],
  );

  useEffect(() => {
    if (map && Array.isArray(points)) {
      const layer = layerGroup();
      points.forEach((point: Place) => {
        if (!point?.location?.latitude || !point?.location?.longitude) {
          return;
        }

        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude,
        });

        let iconUrl = IconPoint;
        if (point.id === activePointPlace?.id || id === point.id) {
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
  }, [map, handlePointClick, points, activePointPlace, id]);

  return <section ref={mapRef} className={`map ${isOffer ? 'offer__map' : 'cities__map'}`}></section>;
}
