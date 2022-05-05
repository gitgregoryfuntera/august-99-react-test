import React from "react";
import classes from './CardSearchInput.module.scss';
const CardSearchInput = ({ handleOnChange }) => {
  return (
    <div className={classes.cardSearchInputContainer}>
      <input onChange={handleOnChange} placeholder="Search" />
    </div>
  );
};

export default CardSearchInput;
