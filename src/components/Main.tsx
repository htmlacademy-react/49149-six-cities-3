import { useEffect, useMemo } from 'react';

import { Place } from '../types';
import Map from './Map';
import PlaceCard from './PlaceCard';
import CitiesMenu from './CitiesMenu';
import SortingOptions from './SortingOptions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedActions } from '../hooks/useTypedActions';
import { useGetOffersQuery } from '../services/api';
import Spinner from './Spinner';

export default function Main() {
  const { setActiveCityPlaces } = useTypedActions();
  const activeCityPlaces = useTypedSelector((state: { app: { activeCityPlaces: Place[] } }) => state.app.activeCityPlaces);
  const sortedCityPlaces = useTypedSelector((state: { app: { sortedCityPlaces: Place[] } }) => state.app.sortedCityPlaces);
  const activeCity = useTypedSelector((state: { app: { activeCity: string } }) => state.app.activeCity);
  const dataCityPlaces = useMemo(() => (sortedCityPlaces.length > 0 ? sortedCityPlaces : activeCityPlaces), [sortedCityPlaces, activeCityPlaces]);

  const { data: offers, isLoading } = useGetOffersQuery(undefined, { refetchOnMountOrArgChange: 1000 });

  useEffect(() => {
    if (offers && !isLoading && activeCity) {
      setActiveCityPlaces(offers);
    }
  }, [!!offers, isLoading, activeCity]);

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
          <section className='cities__places places'>
            <h2 className='visually-hidden'>Places</h2>
            <b className='places__found'>
              {activeCityPlaces.length} places to stay in {activeCity}
            </b>
            <SortingOptions />
            <div className='cities__places-list places__list tabs__content'>
              {dataCityPlaces.map((place: Place) => (
                <PlaceCard key={place.id} card={place} />
              ))}
            </div>
          </section>
          <div className='cities__right-section'>
            {activeCityPlaces && activeCityPlaces.length > 0 && <Map points={activeCityPlaces} />}
          </div>
        </div>
      </div>
    </main>
  );
}
