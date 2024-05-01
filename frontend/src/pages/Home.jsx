import React, { useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/Home.module.css";
import AppContext from "../context/AppContext";
import CircleCard from "../components/CircleCard";
import Button from "../components/utils/Button";

const Home = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const [followingIsActive, setFollowingIsActive] = useState(true);
  const [followingCircles, setFollowingCircles] = useState([]);
  const [registeredIsActive, setRegisteredIsActive] = useState(false);
  const [registeredCircles, setRegisteredCircles] = useState([]);

  const clearFilter = () => {
    setFollowingIsActive(false);
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
        setRegisteredCircles(res.data.filter((circle) => !circle.is_ended));
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getFollowingCircles = async () => {
    try {
      const res = await fetchData(
        "/circles/following",
        "GET",
        undefined,
        appContext.accessToken
      );

      if (res.ok) {
        setFollowingCircles(
          res.data.filter(
            (circle) =>
              !circle.is_ended && new Date(circle.start_date) > Date.now()
          )
        );
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
    getFollowingCircles();
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
            className={registeredIsActive ? "filter-btn-active" : "filter-btn"}
            onClick={() => {
              clearFilter();
              setRegisteredIsActive(!registeredIsActive);
            }}
            name="registered"
          >
            Interested
          </Button>
        </div>
      </div>
      <div className={styles["home-section"]}>
        {followingIsActive ? (
          followingCircles.length > 0 ? (
            followingCircles.map((circle) => (
              <CircleCard
                circle={circle}
                isLive={circle.is_live}
                key={circle.id}
              ></CircleCard>
            ))
          ) : (
            <p className={styles["notification-bar"]}>
              Oops! No Circles by followed users at the moment.
            </p>
          )
        ) : (
          ""
        )}
        {registeredIsActive ? (
          registeredCircles.length > 0 ? (
            registeredCircles.map((circle) => (
              <CircleCard
                circle={circle}
                isLive={circle.is_live}
                key={circle.id}
              ></CircleCard>
            ))
          ) : (
            <p className={styles["notification-bar"]}>
              You have not indicated your interest in any Circles yet.
            </p>
          )
        ) : (
          ""
        )}
      </div>
      <div className={styles["home-footer"]}></div>
    </div>
  );
};

export default Home;
