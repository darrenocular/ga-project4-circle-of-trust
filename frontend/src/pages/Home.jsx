import React, { useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/Home.module.css";
import AppContext from "../context/AppContext";
import CircleCard from "../components/CircleCard";
import Button from "../components/utils/Button";

const Home = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const [followingIsActive, setFollowingIsActive] = useState(false);
  const [interestedIsActive, setInterestedIsActive] = useState(false);
  const [registeredIsActive, setRegisteredIsActive] = useState(false);
  const [registeredCircles, setRegisteredCircles] = useState([]);

  const clearFilter = () => {
    setFollowingIsActive(false);
    setInterestedIsActive(false);
    setRegisteredIsActive(false);
  };

  const getRegisteredCircles = async () => {
    try {
      const res = await fetchData(
        "/circles/registered",
        "GET",
        undefined,
        appContext.accessToken
      );

      if (res.ok) {
        setRegisteredCircles(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Get filtered circles when page loads
  useEffect(() => {
    getRegisteredCircles();
  }, []);

  return (
    <div className={styles["home-page"]}>
      <div className={styles["home-header"]}>
        <div>
          Your <span>Feed</span>
        </div>
        <div className={styles["btn-container"]}>
          <Button
            type="button"
            className={followingIsActive ? "filter-btn-active" : "filter-btn"}
            onClick={() => {
              clearFilter();
              setFollowingIsActive(!followingIsActive);
            }}
            name="following"
          >
            Following
          </Button>
          <Button
            type="button"
            className={interestedIsActive ? "filter-btn-active" : "filter-btn"}
            onClick={() => {
              clearFilter();
              setInterestedIsActive(!interestedIsActive);
            }}
            name="interested"
          >
            Interested
          </Button>
          <Button
            type="button"
            className={registeredIsActive ? "filter-btn-active" : "filter-btn"}
            onClick={() => {
              clearFilter();
              setRegisteredIsActive(!registeredIsActive);
            }}
            name="registered"
          >
            Registered
          </Button>
        </div>
      </div>
      <div className={styles["home-section"]}>
        {followingIsActive && (
          <p className={styles["notification-bar"]}>
            Filter not available in basic plan.
          </p>
        )}
        {interestedIsActive && (
          <p className={styles["notification-bar"]}>
            Filter not available in basic plan.
          </p>
        )}
        {registeredIsActive &&
          registeredCircles.map((circle) => (
            <CircleCard
              circle={circle}
              isLive={circle.is_live}
              key={circle.id}
            ></CircleCard>
          ))}
      </div>
      <div className={styles["home-footer"]}></div>
    </div>
  );
};

export default Home;
