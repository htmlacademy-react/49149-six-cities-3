import { Place } from '../types';
import PlaceCard from './PlaceCard';

type NearPlacesProps = {
  data: Place[];
};

export default function NearPlaces({ data }: NearPlacesProps) {
  return (
    <section className='near-places places'>
      <h2 className='near-places__title'>Other places in the neighbourhood</h2>
      <div className='near-places__list places__list'>
        {data.map((v: Place) => (
          <PlaceCard key={v.id} card={v} styled='near-places' />
        ))}
      </div>
    </section>
  );
}
