import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Place } from '../types';
import { useTypedActions } from './useTypedActions';

const useSortingOptions = (data: Place[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') || '';
  const [activeOption, setActiveOption] = useState<string>(sort);

  const { setSortedPlaces } = useTypedActions();

  const sortNameMap: Record<string, string> = {
    lowHigh: 'Price: low to high',
    highLow: 'Price: high to low',
    topRated: 'Top rated first',
    '': 'Popular',
  };

  const setSortName = (option: string): string => sortNameMap[option] ?? 'Popular';

  const setSortedPlacesByOption = useCallback(
    (option: string) => {
      setActiveOption(option);

      const newSearchParams = new URLSearchParams(searchParams);
      if (option) {
        newSearchParams.set('sort', option);
      } else {
        newSearchParams.delete('sort');
      }
      setSearchParams(newSearchParams);

      let sortedData = [];
      switch (option) {
        case 'lowHigh':
          sortedData = [...data].sort((a, b) => a.price - b.price);
          break;
        case 'highLow':
          sortedData = [...data].sort((a, b) => b.price - a.price);
          break;
        case 'topRated':
          sortedData = [...data].sort((a, b) => b.rating - a.rating);
          break;
        default:
          sortedData = data.slice();
          break;
      }

      setSortedPlaces(sortedData);
    },
    [data, searchParams, setSearchParams, setSortedPlaces],
  );

  useEffect(() => {
    if (sort) {
      setSortedPlacesByOption(sort);
    }
  }, [data]);

  return { activeOption, setActiveOption, setSortName, setSortedPlacesByOption };
};

export default useSortingOptions;
