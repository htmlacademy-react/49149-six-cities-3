import { memo } from 'react';

import { useToggle } from '../hooks/useToggle';
import useSortingOptions from '../hooks/useSortingOptions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { selectorActiveCityPlaces } from '../store/selectors';

function SortingOptions() {
  const activeCityPlaces = useTypedSelector(selectorActiveCityPlaces);
  const { activeOption, setActiveOption, setSortName, setSortedPlacesByOption } = useSortingOptions(activeCityPlaces);
  const { isOpen, toggle, close } = useToggle();

  const handleClickForm = () => {
    toggle();
  };

  const handleClickOption = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const target = event.target as HTMLElement | null;
    if (!target || !(target instanceof HTMLLIElement)) {
      return;
    }

    const targetId = target.id;
    if (!targetId) {
      return;
    }

    const optionMap = {
      popular: '',
      lowHigh: 'lowHigh',
      highLow: 'highLow',
      topRated: 'topRated',
    };

    const optionValue = optionMap[targetId as keyof typeof optionMap];
    if (typeof optionValue === 'string') {
      setActiveOption(optionValue);
      setSortedPlacesByOption(optionValue);
      close();
    }
  };

  if (activeCityPlaces.length === 0) {
    return null;
  }

  return (
    <form className='places__sorting' action='#' method='get' onClick={handleClickForm}>
      <span className='places__sorting-caption'>Sort by </span>
      <span className='places__sorting-type' tabIndex={0}>
        {setSortName(activeOption)}
        <svg className='places__sorting-arrow' width='7' height='4'>
          <use xlinkHref='#icon-arrow-select'></use>
        </svg>
      </span>
      <ul onClick={handleClickOption} className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        <li id='popular' className='places__option places__option--active' tabIndex={0}>
          Popular
        </li>
        <li id='lowHigh' className='places__option' tabIndex={0}>
          Price: low to high
        </li>
        <li id='highLow' className='places__option' tabIndex={0}>
          Price: high to low
        </li>
        <li id='topRated' className='places__option' tabIndex={0}>
          Top rated first
        </li>
      </ul>
    </form>
  );
}

export default memo(SortingOptions);
