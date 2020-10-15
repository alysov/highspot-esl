import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cards from './features/cards/Cards';
import SearchName from './components/SearchName/SearchName';
import './App.css';

import {
  fetchCards,
  getCards,
  hasMoreCards,
  isLoading
} from './features/cards/cardsSlice';

const App = () => {
  const dispatch = useDispatch();
  const cards = useSelector(getCards);
  const hasMore = useSelector(hasMoreCards);
  const isFetching = useSelector(isLoading);
  const [cardsLoading, setCardsLoading] = useState(true);

  const getMoreCards = useCallback(async () => {
    await dispatch(fetchCards());
    setCardsLoading(false);
  }, [dispatch]);

  useEffect(() => { getMoreCards() }, [getMoreCards]);

  return (
    <div className="App">
      <div className='searchHeader'>
        <SearchName />
      </div>
      <InfiniteScroll
        className='cardsWrapper'
        dataLength={cards.length}
        next={getMoreCards}
        hasMore={hasMore}
        hasChildren={!!cards.length && !isFetching}
        loader={<div className='loadingMsg'>Loading&hellip;</div>}
        scrollThreshold='700px'  // avg. height of a card + a bit more
      >
        <Cards cards={cards} loading={cardsLoading} />
      </InfiniteScroll>
      { !cards.length && !isFetching && 
        <p className='noContent'>No cards found.</p>
      }
    </div>
  );
};

export default App;
