import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './SearchName.module.css';

import {
  setSearchName,
  isLoading
} from '../../features/cards/cardsSlice';

const SearchName = () => {
  const [localName, setLocalName] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(isLoading);

  const handleChange = e => {
    var searchName = e.target.value;
    setLocalName(searchName);
    dispatch(setSearchName(searchName));
  }

  return (
    <>
      <input
        type='text'
        className={style.searchName}
        title='Search name'
        placeholder='Search name'
        value={localName}
        onChange={handleChange}
        readOnly={loading}
      />
    </>
  );
};

export default SearchName;
