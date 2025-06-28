import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Place } from '../types';
import { AuthStatus } from '../enums/auth';
import Map from './Map';
import Reviews from './Reviews';
import NearPlaces from './NearPlaces';
import OfferGallery from './OfferGallery';
import PageNotFound from './PageNotFound';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedActions } from '../hooks/useTypedActions';
import { useGetNearbyOffersQuery, useGetOffersQuery, useToggleFavoriteMutation } from '../services/api';
import Spinner from './Spinner';

export default function Offer({ hasAccess }: { hasAccess: AuthStatus }) {
  const { id, city } = useParams();
  const { setActivePointPlace } = useTypedActions();
  const { data: offers, isLoading } = useGetOffersQuery();
  const { data: nearPlaces, isLoading: isNearLoading } = useGetNearbyOffersQuery(id as string);
  const activePointPlace = useTypedSelector((state: { app: { activePointPlace: Place } }) => state.app.activePointPlace);
  const styledRating = useMemo(() => Math.round(activePointPlace.rating * 100) / 5, [activePointPlace?.rating]);

  const [mapNearPlaces, setMapNearPlaces] = useState<Place[]>([]);
  const [isFavorite, setIsFavorite] = useState(activePointPlace?.isFavorite);
  const [toggleFavorite] = useToggleFavoriteMutation();

  const handleClick = () => {
    setIsFavorite((prev) => !prev);
    toggleFavorite({ status: activePointPlace.isFavorite ? 0 : 1, favorite: activePointPlace, offerId: String(id) });
  };

  useEffect(() => {
    if (offers && !isLoading && id) {
      setActivePointPlace(offers.find((place: Place) => place.id === id) as Place);
    }
  }, [id, offers, activePointPlace]);

  useEffect(() => {
    if (nearPlaces) {
      const resultArray = [...nearPlaces.slice(0, 3), activePointPlace];
      setMapNearPlaces(resultArray);
    }

    return () => {};
  }, [nearPlaces, activePointPlace]);

  if (!nearPlaces || !offers) {
    if (isNearLoading || isLoading) {
      return <Spinner />;
    }
    return <PageNotFound />;
  }

  return (
    <main className='page__main page__main--offer'>
      <section className='offer'>
        <OfferGallery />

        <div className='offer__container container'>
          <div className='offer__wrapper'>
            {activePointPlace.isPremium && (
              <div className='offer__mark'>
                <span>Premium</span>
              </div>
            )}
            <div className='offer__name-wrapper'>
              <h1 className='offer__name'>{activePointPlace.title}</h1>
              <button className={`offer__bookmark-button button ${isFavorite ? 'offer__bookmark-button--active' : ''}`} type='button' onClick={handleClick}>
                <svg className='offer__bookmark-icon' width='31' height='33'>
                  <use xlinkHref='#icon-bookmark'></use>
                </svg>
                <span className='visually-hidden'>{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
              </button>
            </div>
            <div className='offer__rating rating'>
              <div className='offer__stars rating__stars'>
                <span style={{ width: `${styledRating}%` }}></span>
                <span className='visually-hidden'>Rating</span>
              </div>
              <span className='offer__rating-value rating__value'>{activePointPlace.rating}</span>
            </div>
            <ul className='offer__features'>
              <li className='offer__feature offer__feature--entire'>Apartment</li>
              <li className='offer__feature offer__feature--bedrooms'>3 Bedrooms</li>
              <li className='offer__feature offer__feature--adults'>Max 4 adults</li>
            </ul>
            <div className='offer__price'>
              <b className='offer__price-value'>&euro;{activePointPlace.price}</b>
              <span className='offer__price-text'>&nbsp;night</span>
            </div>
            <div className='offer__inside'>
              <h2 className='offer__inside-title'>What&apos;s inside</h2>
              <ul className='offer__inside-list'>
                <li className='offer__inside-item'>Wi-Fi</li>
                <li className='offer__inside-item'>Washing machine</li>
                <li className='offer__inside-item'>Towels</li>
                <li className='offer__inside-item'>Heating</li>
                <li className='offer__inside-item'>Coffee machine</li>
                <li className='offer__inside-item'>Baby seat</li>
                <li className='offer__inside-item'>Kitchen</li>
                <li className='offer__inside-item'>Dishwasher</li>
                <li className='offer__inside-item'>Cabel TV</li>
                <li className='offer__inside-item'>Fridge</li>
              </ul>
            </div>
            <div className='offer__host'>
              <h2 className='offer__host-title'>Meet the host</h2>
              <div className='offer__host-user user'>
                <div className='offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper'>
                  <img className='offer__avatar user__avatar' src='img/avatar-angelina.jpg' width='74' height='74' alt='Host avatar' />
                </div>
                <span className='offer__user-name'>Angelina</span>
                <span className='offer__user-status'>Pro</span>
              </div>
              <div className='offer__description'>
                <p className='offer__text'>A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.</p>
                <p className='offer__text'>
                  An independent House, strategically located between Rembrand Square and National Opera, but where the bustle of the city comes to rest in this alley flowery and colorful.
                </p>
              </div>
            </div>
            <Reviews hasAccess={hasAccess} />
          </div>
        </div>

        {mapNearPlaces.length > 0 ? <Map points={mapNearPlaces} id={id} city={city!} /> : null}
      </section>
      <div className='container'>
        <NearPlaces data={mapNearPlaces.slice(0, 3)} />
      </div>
    </main>
  );
}
