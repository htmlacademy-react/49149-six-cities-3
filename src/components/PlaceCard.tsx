import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { Place } from '../types';
import { Paths } from '../enums/paths';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedActions } from '../hooks/useTypedActions';
import { useToggleFavoriteMutation } from '../services/api';
import { AuthStatus } from '../enums/auth';

type CardProps = {
  card: Place;
  styled?: string;
};

export default function PlaceCard({ card, styled = 'cities' }: CardProps): JSX.Element {
  const authorizationStatus = useTypedSelector((state) => state.app.authorizationStatus);
  const activePointPlace = useTypedSelector((state: { app: { activePointPlace: Place } }) => state.app.activePointPlace);
  const { title: name, price, rating, type, previewImage: poster, isPremium, id, city } = card;
  const styledRating = useMemo(() => Math.round(rating * 100) / 5, [rating]);
  const [hasHoverClass, setHasHoverClass] = useState(false);
  const { setActivePointPlace } = useTypedActions();
  const linkPath = Paths.Offer.replace(':city', String(city.name.toLocaleLowerCase())).replace(':id', String(id));

  const [isFavorite, setIsFavorite] = useState(card.isFavorite);
  const [toggleFavorite] = useToggleFavoriteMutation();

  const handleClick = () => {
    setIsFavorite((prev) => !prev);
    toggleFavorite({ status: card.isFavorite ? 0 : 1, favorite: card, offerId: String(id) });
  };

  const handleMouseOver = () => {
    setHasHoverClass(true);
    setActivePointPlace(card);
  };

  const handleMouseOut = () => {
    setHasHoverClass(false);
    setActivePointPlace({} as Place);
  };

  return (
    <article className={`${styled}__card place-card`} id={id}>
      {isPremium && (
        <div className='place-card__mark'>
          <span>Premium</span>
        </div>
      )}
      <div className={`${styled}__image-wrapper place-card__image-wrapper`}>
        <Link to={linkPath} style={{ opacity: hasHoverClass ? 0.5 : 1 }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <img className='place-card__image' src={poster} width={styled === 'favorites' ? '150' : '260'} height={styled === 'favorites' ? '110' : '200'} alt='Place image' />
        </Link>
      </div>
      <div className={`${styled}__card-info place-card__info`}>
        <div className='place-card__price-wrapper'>
          <div className='place-card__price'>
            <b className='place-card__price-value'>&euro;{price}</b>
            <span className='place-card__price-text'>&#47;&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button button ${isFavorite ? 'place-card__bookmark-button--active' : ''}`} type='button' onClick={handleClick} disabled={authorizationStatus !== AuthStatus.Auth}>
            <svg className='place-card__bookmark-icon' width='18' height='19'>
              <use xlinkHref='#icon-bookmark'></use>
            </svg>
            <span className='visually-hidden'>{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className='place-card__rating rating'>
          <div className='place-card__stars rating__stars'>
            <span style={{ width: `${styledRating}%` }}></span>
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <h2 className='place-card__name'>
          <Link to={linkPath} style={{ color: activePointPlace?.id === id ? 'red' : 'inherit' }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {name}
          </Link>
        </h2>
        <p className='place-card__type'>{type}</p>
      </div>
    </article>
  );
}
