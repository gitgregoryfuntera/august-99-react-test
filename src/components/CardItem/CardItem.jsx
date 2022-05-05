import React from "react";
import classes from "./CardItem.module.scss";
const CardItem = ({ mission_name, launch_success, links, details }) => {
  const { mission_patch } = links;
  const launchStatus = launch_success ? "success" : "failure";
  return (
    <div className={classes.itemContainer}>
      <div className={classes.itemTitle}>
        <h3>{mission_name}</h3>
        <span
          className={`${classes.launchStatus} ${
            launch_success ? classes.success : classes.failure
          }`}
        >
          {launchStatus}
        </span>
      </div>

      <div className={classes.itemDetails}>
        <div className={classes.itemImageContainer}>
          <img src={mission_patch} loading="lazy"/>
        </div>
        <div className={classes.itemTextContainer}>
          <p className={classes.text}>{details}</p>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
