import React, { useState, useContext, useEffect } from "react";
import styles from "./styles/CircleCard.module.css";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const CircleCard = ({ circle, isLive, isEnded }) => {
  const [tags, setTags] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const fetchData = useFetch();
  const appContext = useContext(AppContext);

  const getTags = async () => {
    try {
      const res = await fetchData(
        "/circles/tags",
        "POST",
        {
          circle_id: circle.id,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setTags(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getRegisteredUsers = async () => {
    try {
      const res = await fetchData(
        "/circles/registrations",
        "POST",
        {
          circle_id: circle.id,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setRegisteredUsers(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Get circle's tags when card loads
  useEffect(() => {
    getTags();
    getRegisteredUsers();
  }, []);

  return (
    <div className={styles["card-container"]}>
      <Link to={`/circle/${circle.id}`} className={styles["link"]}>
        <div className={styles["status-bar"]}>
          {isEnded ? (
            <p className={styles["status-ended"]}>Ended</p>
          ) : isLive ? (
            <>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Red_Circle_full.png"
                alt="live"
              ></img>
              <span>Live</span>
            </>
          ) : new Date(circle.start_date) < Date.now() ? (
            <p className={styles["status-ended"]}>Ended</p>
          ) : (
            <p className={styles["status-upcoming"]}>Upcoming</p>
          )}
        </div>
        <div className={styles["primary-panel"]}>
          <p className={styles["title"]}>{circle.title}</p>
          {isEnded ? (
            <p className={styles["start-date"]}>Circle ended</p>
          ) : isLive ? (
            <p className={styles["start-date"]}>
              Started on {circle.start_date}
            </p>
          ) : new Date(circle.start_date) >= Date.now() ? (
            <p className={styles["start-date"]}>
              Starting on {circle.start_date}
            </p>
          ) : (
            <p className={styles["start-date"]}>Circle ended</p>
          )}
          {!isEnded && isLive ? (
            <p className={styles["participants-count"]}>
              {Math.floor(Math.random() * 90) + 10} listening
            </p>
          ) : (
            new Date(circle.start_date) >= Date.now() && (
              <p className={styles["participants-count"]}>
                {registeredUsers.length} interested
              </p>
            )
          )}
        </div>
        <div className={styles["secondary-panel"]}>
          <div className={styles["host-profile"]}>
            <img
              className={styles["host-img"]}
              src={`https://getstream.io/random_svg/?name=${circle.username}`}
            ></img>
            <span className={styles["username"]}>{circle.username}</span>
            <span className={styles["host-tag"]}>Host</span>
          </div>
          <div className={styles["tags-container"]}>
            {tags.map((tag, idx) => (
              <div key={idx}>{tag}</div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CircleCard;
