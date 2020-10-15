import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { SLICE_NAME as CARDS_SLICE_NAME } from '../features/cards/cardsSlice';

export default function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      [CARDS_SLICE_NAME]: cardsReducer
    },
    preloadedState
  });
};
