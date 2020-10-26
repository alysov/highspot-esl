import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import mock from './cardsData.json';

export const SLICE_NAME = 'cards';
export const initialState = {
  loading: false,
  cards: [],
  page: 1,
  total: Infinity,
  error: null,
  searchName: '',
  favorites: {}
};

const url = 'https://api.elderscrollslegends.io/v1/cards';
const PAGE_SIZE = 20;

export const fetchCards = createAsyncThunk(
  `${SLICE_NAME}/fetch`,
  async (_, { getState }) => {
    const { page, searchName } = getState()[SLICE_NAME];
    // TODO?: reject call if one is already in flight (loading==true)

    // Could probably use something like `qs` here if query gets any more complex than this.
    const res = await fetch(`${url}?page=${page}&pageSize=${PAGE_SIZE}&name=${encodeURIComponent(searchName)}`);
    const json = await res.json();

    // OR use mock data
    // const json = await Promise.resolve(mock);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    return json;
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState()[SLICE_NAME];
      return !loading;
    }
  }
);

const DELAY = 300;
var timerId;
// Exporting this separately as it will be a debounced action
export const setSearchName = name => (dispatch, getState) => {
  const { searchName } = getState()[SLICE_NAME];

  if (timerId) {
    // clear out previously queued action
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    timerId = undefined;

    // Execute action only if the searchName has changed
    if (searchName === name) {
      console.log(`rejecting search term "${name}"`);
      return;
    }

    dispatch(cardsSlice.actions.setSearchName(name));
    dispatch(fetchCards());
  }, DELAY);
}

export const cardsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setSearchName: (state, action) => {
      state.page = initialState.page;
      state.total = initialState.total;
      state.searchName = action.payload;
    },
    favoriteCard: (state, action) => {
      state.favorites[action.payload.id] = action.payload;
    },
    unfavoriteCard: (state, action) => {
      delete state.favorites[action.payload.id];
    }
  },
  extraReducers: {
    [fetchCards.pending]: state => {
      state.loading = true;
    },
    [fetchCards.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.cards = (state.page === 1 ? [] : state.cards).concat(action.payload.cards);
      state.page++;
      state.total = action.payload._totalCount;
    },
    [fetchCards.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    }
  }
});

export const { favoriteCard, unfavoriteCard } = cardsSlice.actions;

// selectors

export const getSearchName = state => state[SLICE_NAME].searchName;
export const getCards = state => state[SLICE_NAME].cards;
export const hasMoreCards = state => state[SLICE_NAME].total > state[SLICE_NAME].cards.length;
export const isLoading = state => state[SLICE_NAME].loading;
export const isFavorite = (state, id) => !!state[SLICE_NAME].favorites[id];
export const getFavorites = state => Object.values(state[SLICE_NAME].favorites);

export default cardsSlice.reducer;
