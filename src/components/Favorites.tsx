import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Place } from '../types';
import { Paths } from '../enums/paths';
import PlaceCard from './PlaceCard';
import { useGetFavoriteQuery } from '../services/api';

export default function Favorites() {
  const { data: favorites, isLoading } = useGetFavoriteQuery();
  const [favoritesGroupCity, setFavoritesGroupCity] = useState<Record<string, typeof favorites>>({});

  useEffect(() => {
    if (favorites && !isLoading) {
      // Группируем предложения по городам
      const groupedFavoriteByCity = favorites.reduce<Record<string, typeof favorites>>((acc, favorite) => {
        const cityName = favorite.city.name;

        if (!acc[cityName]) {
          acc[cityName] = [];
        }
        acc[cityName].push(favorite);

        return acc;
      }, {});

      setFavoritesGroupCity(groupedFavoriteByCity);
    }
    return () => {
      setFavoritesGroupCity({});
    };
  }, [favorites, isLoading]);

  return (
    <div className='page'>
      <main className='page__main page__main--favorites'>
        <div className='page__favorites-container container'>
          <section className='favorites'>
            <h1 className='favorites__title'>Saved listing</h1>
            <ul className='favorites__list'>
              {Object.entries(favoritesGroupCity).map(([city, places]) => (
                <li key={city} className='favorites__locations-items'>
                  <div className='favorites__locations locations locations--current'>
                    <div className='locations__item'>
                      <a className='locations__item-link' href='#'>
                        <span>{city}</span>
                      </a>
                    </div>
                  </div>
                  <div className='favorites__places'>{places && places.map((place: Place) => <PlaceCard key={place.id} card={place} styled='favorites' />)}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className='footer container'>
        <Link className='footer__logo-link' to={Paths.Main}>
          <img className='footer__logo' src='img/logo.svg' alt='6 cities logo' width='64' height='33' />
        </Link>
      </footer>
    </div>
  );
}
