import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import {
  isFavorite,
  favoriteCard,
  unfavoriteCard
} from '../../features/cards/cardsSlice';
import styles from './Cards.module.css';

const Card = ({ card }) => {
  const {
    id,
    name,
    type,
    subtypes: [subtype] = [],
    imageUrl,
    text,
    set: {
      name: setName
    } = {}
  } = card;

  const isFavoriteCard = useSelector(state => isFavorite(state, id));
  const dispatch = useDispatch();

  const toggleFavorite = () => {
    if (isFavoriteCard) {
      dispatch(unfavoriteCard(card));
    } else {
      dispatch(favoriteCard(card));
    }
  }

  const cardClass = classNames(styles.card, { [styles.favorite]: isFavoriteCard });

  return (
    <div className={cardClass} onClick={toggleFavorite}>
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={imageUrl} alt={name} />
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.type}>{subtype ? subtype : type}</div>
      <div className={styles.setName}>{setName}</div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default Card;
