import React from 'react';
import styles from './Cards.module.css';

const Card = ({ card }) => {
  const {
    name,
    type,
    subtypes: [subtype] = [],
    imageUrl,
    text,
    set: {
      name: setName
    } = {}
  } = card;

  return (
    <div className={styles.card}>
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
