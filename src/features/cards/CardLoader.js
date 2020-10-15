import React from "react";
import ContentLoader from "react-content-loader";
import styles from './Cards.module.css';

const CardLoader = (props) => (
  <ContentLoader 
    // speed={2}
    // width={350}
    // height={680}
    viewBox="0 0 350 680"
    // backgroundColor="#949494"
    // foregroundColor="#bebbbb"
    className={styles.cardLoader}
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="350" height="580" /> 
    <rect x="85" y="590" rx="3" ry="3" width="180" height="14" /> 
    <rect x="135" y="608" rx="3" ry="3" width="80" height="12" /> 
    <rect x="125" y="624" rx="3" ry="3" width="100" height="12" /> 
    <rect x="20" y="648" rx="3" ry="3" width="310" height="12" /> 
    <rect x="25" y="665" rx="3" ry="3" width="300" height="12" />
  </ContentLoader>
);

export default CardLoader;
