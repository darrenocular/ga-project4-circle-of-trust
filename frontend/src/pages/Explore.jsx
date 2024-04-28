import React, { useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/Explore.module.css";
import AppContext from "../context/AppContext";
import Carousel from "../components/Carousel";
import CircleCard from "../components/CircleCard";

const Explore = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();

  return (
    <div className={styles["explore-page"]}>
      <div className={styles["explore-header"]}>
        <Carousel />
      </div>
      <div className={styles["explore-section"]}>
        <p className={styles["section-header"]}>Live</p>
        <div className={styles["section-body"]}>
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
        </div>
      </div>
      <div className={styles["explore-section"]}>
        <p className={styles["section-header"]}>Upcoming</p>
        <div className={styles["section-body"]}>
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
          <CircleCard />
        </div>
      </div>
      <div className={styles["explore-footer"]}></div>
    </div>
  );
};

export default Explore;
