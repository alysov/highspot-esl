import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import makeStore from './app/store';
import App from './App';

const store = makeStore();

// TODO: most likely need to upgrade testing-library for new react version
// Skipping until that time.
it.skip('starts off with a loading indicator', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/Loading…/i)).toBeInTheDocument();
});
