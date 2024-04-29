import React, { useState, useContext, useEffect } from "react";
import styles from "./styles/CircleCard.module.css";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const CircleCard = ({ circle, isLive }) => {
  const [tags, setTags] = useState([]);
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

  // Get circle's tags when card loads
  useEffect(() => {
    getTags();
  }, []);

  return (
    <div className={styles["card-container"]}>
      <Link to={`/circle/${circle.id}`} className={styles["link"]}>
        <div className={styles["status-bar"]}>
          {isLive && (
            <>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Red_Circle_full.png"
                alt="live"
              ></img>
              Live
            </>
          )}
        </div>
        <div className={styles["primary-panel"]}>
          <p className={styles["title"]}>{circle.title}</p>
          {isLive ? (
            <p className={styles["participants-count"]}>XX listening</p>
          ) : (
            <p className={styles["participants-count"]}>XX signed up</p>
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
