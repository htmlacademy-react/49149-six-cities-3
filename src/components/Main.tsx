import { useEffect, useMemo } from 'react';
import { shallowEqual } from 'react-redux';

import Map from './Map';
import CitiesMenu from './CitiesMenu';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedActions } from '../hooks/useTypedActions';
import { useGetOffersQuery } from '../services/api';
import Spinner from './Spinner';
import { selectActiveCity, selectorActiveCityPlaces, selectorCombinedPlaces, selectPlacesCount } from '../store/selectors';
import PlaceCardList from './PlaceCardList';

export default function Main() {
  const { setAllPlaces } = useTypedActions();
  const { data: offers, isLoading } = useGetOffersQuery(undefined, { refetchOnMountOrArgChange: 60000 });

  const activeCityPlaces = useTypedSelector(selectorActiveCityPlaces, shallowEqual);
  const activeCity = useTypedSelector(selectActiveCity);
  const placesCount = useTypedSelector(selectPlacesCount);
  const dataCityPlaces = useTypedSelector(selectorCombinedPlaces);

  const mapPoints = useMemo(() => activeCityPlaces, [activeCityPlaces]);

  useEffect(() => {
    if (offers && !isLoading) {
      setAllPlaces(offers);
    }
  }, [!!offers, isLoading]);

  if (isLoading) {
    return (
      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>
        <CitiesMenu />

        <Spinner />
      </main>
    );
  }

  return (
    <main className='page__main page__main--index'>
      <h1 className='visually-hidden'>Cities</h1>

      <div className='tabs'>
        <CitiesMenu />
      </div>

      <div className='cities'>
        <div className='cities__places-container container'>
          <PlaceCardList placesCount={placesCount} activeCity={activeCity} dataCityPlaces={dataCityPlaces} />
          <div className='cities__right-section'>{activeCityPlaces && placesCount > 0 && <Map points={mapPoints} city={activeCity} />}</div>
        </div>
      </div>
    </main>
  );
}
