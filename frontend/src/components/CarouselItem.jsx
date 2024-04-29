import React from "react";
import styles from "./styles/CarouselItem.module.css";

const CarouselItem = () => {
  return (
    <div className={styles["img-container"]}>
      <img
        src="https://www.worldatlas.com/r/w1200/upload/59/ef/f6/shutterstock-322328156.jpg"
        alt="olympics"
      />
      <div className={styles["info-panel"]}>
        <p className={styles["title"]}>Title</p>
        <div className={styles["tags-container"]}>
          <div>Tag 1</div>
          <div>Tag 2</div>
        </div>
        <div className={styles["host-container"]}>
          <img
            className={styles["host-img"]}
            src={`https://getstream.io/random_svg/?name=user`}
          ></img>
          <span className={styles["username"]}>@username</span>
          <span className={styles["host-tag"]}>Host</span>
        </div>
        <p className={styles["description"]}>Description</p>
      </div>
    </div>
  );
};

export default CarouselItem;
