import React, { useState, useContext } from "react";
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

  const clearFilter = () => {
    setFollowingIsActive(false);
    setInterestedIsActive(false);
    setRegisteredIsActive(false);
  };

  const handleFilter = (e) => {
    e.preventDefault();
  };

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
            onClick={(e) => {
              clearFilter();
              setFollowingIsActive(!followingIsActive);
              handleFilter(e);
            }}
            name="following"
          >
            Following
          </Button>
          <Button
            type="button"
            className={interestedIsActive ? "filter-btn-active" : "filter-btn"}
            onClick={(e) => {
              clearFilter();
              setInterestedIsActive(!interestedIsActive);
              handleFilter(e);
            }}
            name="interested"
          >
            Interested
          </Button>
          <Button
            type="button"
            className={registeredIsActive ? "filter-btn-active" : "filter-btn"}
            onClick={(e) => {
              clearFilter();
              setRegisteredIsActive(!registeredIsActive);
              handleFilter(e);
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
        {registeredIsActive && <div></div>}
      </div>
      <div className={styles["home-footer"]}></div>
    </div>
  );
};

export default Home;
