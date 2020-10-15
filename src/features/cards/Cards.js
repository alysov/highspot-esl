import React from 'react';
import Card from './Card';
import CardLoader from './CardLoader';

const Cards = ({ cards, loading }) => {
  if (loading) {
    return (
      <>
        { [...Array(12)].map((_, i) => (<CardLoader key={i} />)) }
      </>
    );
  } else {
    return (
      <>
        { cards.map(card => 
          <Card
            key={card.id}
            card={card}
          />
        ) }
      </>
    );
  }
};

export default Cards;
