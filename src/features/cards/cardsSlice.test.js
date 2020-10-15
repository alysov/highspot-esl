import reducer, {
  SLICE_NAME,
  getCards,
  hasMoreCards,
  isLoading,
  fetchCards,
  getSearchName,
  setSearchName,
  cardsSlice,
  initialState
} from './cardsSlice';
import makeStore from '../../app/store';
import mockData from './cardsData.json';
import mockDataP2 from './cardsData2.json';
import mockDataNameFoo from './cardsDataNameFoo.json';

const getState = (state) => ({[SLICE_NAME]: reducer(state, {})});

test('#getCards selector initially returns an empty list', () => {
  const cards = getCards(getState());
  expect(cards).toStrictEqual([]);
});
test('#getCards selector returns list of available cards', () => {
  const prep = {
    cards: [
      { id: 123, name: 'foo' },
      { id: 234, name: 'bar' }
    ]
  };
  const cards = getCards(getState(prep));
  expect(cards).toEqual(prep.cards);
});

test('Initially, there are more cards available', () => {
  const hasMore = hasMoreCards(getState());
  expect(hasMore).toBe(true);
});
test('If we don\'t have all the cards, there are more available', () => {
  const prep = {
    cards: [
      { id: 123, name: 'foo' },
      { id: 234, name: 'bar' }
    ],
    total: 5
  };
  const hasMore = hasMoreCards(getState(prep));
  expect(hasMore).toBe(true);
});
test('When we get all the cards, no more is available', () => {
  const prep = {
    cards: [
      { id: 123, name: 'foo' },
      { id: 234, name: 'bar' }
    ],
    total: 2  // same as number of cards
  };
  const hasMore = hasMoreCards(getState(prep));
  expect(hasMore).toBe(false);
});

test('Initially, we are not loading anything', () => {
  const loading = isLoading(getState());
  expect(loading).toBe(false);
});
test('Loading is set when a request is initiated', () => {
  const store = makeStore();

  store.dispatch(fetchCards());
  var state = store.getState();

  expect(isLoading(state)).toBe(true);
});
test('Loading is unset when a request completes', async () => {
  const store = makeStore();

  await store.dispatch(fetchCards());
  var state = store.getState();

  expect(isLoading(state)).toBe(false);
});

describe('#fetchCards', () => {
  it('gets a page of cards from an external API', async () => {
    const store = makeStore();
    var state = store.getState()[SLICE_NAME];

    expect(state.cards).toStrictEqual([]);
    expect(state.page).toEqual(1);

    await store.dispatch(fetchCards());
    state = store.getState()[SLICE_NAME];

    expect(state.cards).toEqual(mockData.cards);
    expect(state.page).toBe(2);
  });
  it('updates cards\' total', async () => {
    const store = makeStore();
    var state = store.getState()[SLICE_NAME];
    expect(state.total).not.toBe(mockData._totalCount);

    await store.dispatch(fetchCards());
    state = store.getState()[SLICE_NAME];

    expect(state.total).toBe(mockData._totalCount);
  });
  it('appends new cards to the list for new pages', async () => {
    const store = makeStore();
    var state = store.getState()[SLICE_NAME];

    // first page
    await store.dispatch(fetchCards());
    // second page
    await store.dispatch(fetchCards());
    state = store.getState();

    expect(getCards(state)).toEqual(mockData.cards.concat(mockDataP2.cards));
    expect(hasMoreCards(state)).toBe(false);
  });
  it('replaces cards for page 1', async () => {
    const prep = {
      [SLICE_NAME]: {
        ...initialState,
        cards: mockDataP2.cards,
        total: mockDataP2._totalCount
      }
    };
    const store = makeStore(prep);
    var state = store.getState()[SLICE_NAME];

    expect(state.cards).toEqual(mockDataP2.cards);
    expect(state.page).toBe(1);

    await store.dispatch(fetchCards());
    state = store.getState()[SLICE_NAME];

    expect(state.cards).toEqual(mockData.cards);
    expect(state.page).toBe(2);
  });
});

test('#getSearchName selector is initially empty', () => {
  const searchName = getSearchName(getState());
  expect(searchName).toBe('');
});
test('#getSearchName selector returns the Name used for search', () => {
  const prep = {
    searchName: 'foo'
  };
  const searchName = getSearchName(getState(prep));
  expect(searchName).toBe('foo');
});

describe('#setSearchName action', () => {
  var dispatch;
  var action = cardsSlice.actions.setSearchName('foo');
  const flushPromises = () => new Promise(res => process.nextTick(res));
  
  beforeEach(() => {
    jest.useFakeTimers();
    dispatch = jest.fn();
  });
  afterEach(() => {
    // clear out any pending timers, so that the timerId gets reset
    jest.runAllTimers();
  });

  it('dispatches asynchronously', () => {
    setSearchName('foo')(dispatch, getState);

    expect(dispatch).not.toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalledTimes(1);

    jest.runAllTimers();

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(action);
  });
  it('debounces calls with final tail call (uses last value only)', () => {
    // Emulate typing 'foo' character by character, but quickly enough
    setSearchName('f')(dispatch, getState);
    setSearchName('fo')(dispatch, getState);
    setSearchName('foo')(dispatch, getState);

    // All 3 names result in a `setTimeout` call
    expect(setTimeout).toHaveBeenCalledTimes(3);
    // but 'f' and 'fo' pending timers get cleared
    expect(clearTimeout).toHaveBeenCalledTimes(2);
    
    jest.runAllTimers();
    
    expect(dispatch).toHaveBeenCalledTimes(2);
    // and only 'foo' name gets set
    expect(dispatch).toHaveBeenCalledWith(action);
  });
  it('eventually sets provided value in the state', () => {
    var state;

    // Create mock implementation of `dispatch` to call the reducer directly
    dispatch.mockImplementationOnce(a => {
      // set the closure variable so that we can access it immediately
      state = reducer(undefined, a);
      return state;
    });
    
    setSearchName('b')(dispatch, getState);
    setSearchName('ba')(dispatch, getState);
    setSearchName('bar')(dispatch, getState);
    jest.runAllTimers();
    
    expect(state.searchName).toBe('bar');
  });
  it('fetches all cards with the provided name', async () => {
    const store = makeStore();

    store.dispatch(setSearchName('foo'));
    jest.runAllTimers();

    // To get around trying observe a function that is run from inside setTimeout,
    // we have to resort to flushing any pending promises, like fetching cards.
    await flushPromises();

    var state = store.getState()[SLICE_NAME];

    expect(state.searchName).toBe('foo');
    expect(state.cards).toEqual(mockDataNameFoo.cards);
    expect(state.total).toBe(mockDataNameFoo._totalCount);
  });
  it('keeps existing cards data, but resets page and total counts', async () => {
    const store = makeStore();
    var state = store.getState()[SLICE_NAME];

    // get some cards
    await store.dispatch(fetchCards());

    store.dispatch(setSearchName('foo'));
    jest.runAllTimers();

    // Note: getting state before flushing promises so that we do not get
    // the full cards list, but only a pending request.
    state = store.getState()[SLICE_NAME];
    expect(state.cards).toEqual(mockData.cards);
    expect(state.page).toBe(1);
    expect(state.total).toBe(initialState.total);
  });
  it('avoids calling API for the same name consecutively', () => {
    const prep = {
      // previously searched for name
      searchName: 'foo'
    };

    setSearchName('foo')(dispatch, getState.bind(null, prep));
    jest.runAllTimers();

    expect(dispatch).not.toHaveBeenCalled();
  });
  it('avoids calling for intermediate retyped name', () => {
    const prep = {
      // previously searched for name
      searchName: 'foo'
    };
    const getPreppedState = getState.bind(null, prep);

    // Emulate re-typing "foo" letter by letter
    setSearchName('f')(dispatch, getPreppedState);
    setSearchName('fo')(dispatch, getPreppedState);
    setSearchName('foo')(dispatch, getPreppedState);
    jest.runAllTimers();

    expect(dispatch).not.toHaveBeenCalled();
  });
});
