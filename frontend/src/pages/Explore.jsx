import React, { useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/Explore.module.css";
import AppContext from "../context/AppContext";
import Carousel from "../components/Carousel";
import CircleCard from "../components/CircleCard";

const Explore = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const [upcomingCircles, setUpcomingCircles] = useState([]);
  const [liveCircles, setLiveCircles] = useState([]);
  const [popularCircles, setPopularCircles] = useState([]);

  const getAllCircles = async () => {
    try {
      const res = await fetchData(
        "/circles/all",
        "GET",
        undefined,
        appContext.accessToken
      );

      if (res.ok) {
        setUpcomingCircles(
          res.data.filter(
            (circle) =>
              circle["is_live"] === false &&
              new Date(circle["start_date"]) >= Date.now()
          )
        );
        setLiveCircles(res.data.filter((circle) => circle["is_live"] === true));
        setPopularCircles(res.data.slice(0, 5));
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Get all circles when page loads
  useEffect(() => {
    getAllCircles();
  }, []);

  return (
    <div className={styles["explore-page"]}>
      <div className={styles["explore-header"]}>
        <Carousel circles={popularCircles} />
      </div>
      <div className={styles["explore-section"]}>
        <p className={styles["section-header"]}>Live</p>
        <div className={styles["section-body"]}>
          {liveCircles.map((circle, idx) => (
            <CircleCard circle={circle} isLive={true} key={idx} />
          ))}
        </div>
      </div>
      <div className={styles["explore-section"]}>
        <p className={styles["section-header"]}>Upcoming</p>
        <div className={styles["section-body"]}>
          {upcomingCircles.map((circle, idx) => (
            <CircleCard circle={circle} isLive={false} key={idx} />
          ))}
        </div>
      </div>
      <div className={styles["explore-footer"]}></div>
    </div>
  );
};

export default Explore;
