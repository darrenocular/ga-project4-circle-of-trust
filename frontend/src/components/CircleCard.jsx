import React from "react";
import styles from "./styles/CircleCard.module.css";
import { Link } from "react-router-dom";

const CircleCard = (props) => {
  return (
    <div className={styles["card-container"]}>
      <div className={styles["status-bar"]}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Red_Circle_full.png"
          alt="live"
        ></img>
        Live
      </div>
      <div className={styles["primary-panel"]}>
        <p className={styles["title"]}>Title</p>
        <p className={styles["participants-count"]}>27 listening</p>
      </div>
      <div className={styles["secondary-panel"]}>
        <Link to="/profile" className={styles["host-profile"]}>
          <img
            className={styles["host-img"]}
            src={`https://getstream.io/random_svg/?name=user`}
          ></img>
          <span className={styles["username"]}>@username</span>
          <span className={styles["host-tag"]}>Host</span>
        </Link>
        <div className={styles["tags-container"]}>
          <div>Tag 1</div>
          <div>Tag 2</div>
        </div>
      </div>
    </div>
  );
};

export default CircleCard;
