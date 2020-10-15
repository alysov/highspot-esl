import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import makeStore from '../../app/store';
import {
  fetchCards,
  getSearchName
} from '../../features/cards/cardsSlice';
import SearchName from './SearchName';

const store = makeStore();

it('has no value initially', () => {
  const { getByPlaceholderText } = render(
    <Provider store={store}>
      <SearchName />
    </Provider>
  );
  const input = getByPlaceholderText('Search name');

  expect(input).toBeInTheDocument();
  expect(input).not.toHaveValue();
});
it('is initially writable', () => {
  const { getByPlaceholderText } = render(
    <Provider store={store}>
      <SearchName />
    </Provider>
  );
  const input = getByPlaceholderText('Search name');

  expect(input).not.toHaveAttribute('readonly');
});
it('is read-only when loading data', () => {
  const { getByPlaceholderText } = render(
    <Provider store={store}>
      <SearchName />
    </Provider>
  );
  const input = getByPlaceholderText('Search name');
  store.dispatch(fetchCards());

  expect(input).toHaveAttribute('readonly');
});
it('updates search name on change', () => {
  jest.useFakeTimers();
  const { getByPlaceholderText } = render(
    <Provider store={store}>
      <SearchName />
    </Provider>
  );
  const input = getByPlaceholderText('Search name');
  fireEvent.change(input, { target: { value: 'foo' } });
  jest.runAllTimers();
  const state = store.getState();

  expect(input).toHaveValue('foo');
  expect(getSearchName(state)).toBe('foo');
});
