import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import makeStore from '../../app/store';
import {
  SLICE_NAME,
  favoriteCard,
  unfavoriteCard,
  isFavorite
} from './cardsSlice';
import Card from './Card';
import styles from './Cards.module.css';

const card = {
  "name": "Raise Dead",
  "rarity": "Legendary",
  "type": "Action",
  "cost": 2,
  "set": {
    "id": "cs",
    "name": "Core Set",
    "_self": "https://api.elderscrollslegends.io/v1/sets/cs"
  },
  "collectible": false,
  "text": "Summon a random creature from each discard pile.",
  "attributes": [
    "Endurance"
  ],
  "unique": false,
  "imageUrl": "https://images.elderscrollslegends.io/cs/raise_dead.png",
  "id": "ce7be2e72d6b06a52e50bed01952801ca4ecfade"
};
const card2 = {
  "name": "Redoran Enforcer",
  "rarity": "Common",
  "type": "Creature",
  "subtypes": [
    "Dark Elf"
  ],
  "cost": 2,
  "power": 2,
  "health": 3,
  "set": {
    "id": "cs",
    "name": "Core Set",
    "_self": "https://api.elderscrollslegends.io/v1/sets/cs"
  },
  "collectible": true,
  "soulSummon": 50,
  "soulTrap": 5,
  "attributes": [
    "Intelligence"
  ],
  "unique": false,
  "imageUrl": "https://images.elderscrollslegends.io/cs/redoran_enforcer.png",
  "id": "ebbd44e57df2df1c46f7eaeb7e7847d3c1b2ed46"
};

const store = makeStore();

it('includes card name', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  expect(getByText(card.name)).toBeInTheDocument();
});
it('includes card image', () => {
  const { getByAltText } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );
  const img = getByAltText(card.name);

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', card.imageUrl);
});
it('includes card set name', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  expect(getByText(card.set.name)).toBeInTheDocument();
});
it('prefers card subtype over type', () => {
  // This card has both type of "Creature" and subtype of "Dark Elf".
  // The latter is more descriptive, so we prefer that for display.
  // It also matches what card shows in its image.
  const { getByText, queryByText } = render(
    <Provider store={store}>
      <Card card={card2} />
    </Provider>
  );

  expect(getByText(card2.subtypes[0])).toBeInTheDocument();
  expect(queryByText(card2.type)).not.toBeInTheDocument();
});
it('shows card type when no subtype is present', () => {
  // This card has no subtype and type of "Action".
  const { getByText } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  expect(getByText(card.type)).toBeInTheDocument();
});
it('includes card text', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  expect(getByText(card.text)).toBeInTheDocument();
});
it('is not marked as a favorite (via className) by default', () => {
  const { container } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  expect(container.firstChild).not.toHaveClass(styles.favorite);
});
it('is marked as a favorite (via className) if the card is a favorite', () => {
  store.dispatch(favoriteCard(card));

  const { container } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  expect(container.firstChild).toHaveClass(styles.favorite);
});
it('toggles a card as a favorite on click', () => {
  // need to use a local copy of the store to avoid polluting state
  const store = makeStore();
  const dispatch = jest.spyOn(store, 'dispatch');
  const { container } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  fireEvent.click(container.firstChild);

  expect(dispatch).toHaveBeenCalledWith(favoriteCard(card));
});
it('unfavorites a favorite card on click', () => {
  const prep = {
    [SLICE_NAME]: {
      favorites: {
        [card.id]: card
      }
    }
  };
  // need to use a local copy of the store to avoid polluting state
  const store = makeStore(prep);
  const dispatch = jest.spyOn(store, 'dispatch');
  const { container } = render(
    <Provider store={store}>
      <Card card={card} />
    </Provider>
  );

  fireEvent.click(container.firstChild);

  expect(dispatch).toHaveBeenCalledWith(unfavoriteCard(card));
});
