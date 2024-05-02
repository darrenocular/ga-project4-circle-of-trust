import React, { useContext } from "react";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import { Link } from "react-router-dom";
import styles from "./styles/FlagItem.module.css";
import Button from "./utils/Button";

const FlagItem = ({ flag, getAllFlags }) => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();

  const handleDeleteFlag = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchData(
        "/circles/flags",
        "DELETE",
        {
          circle_id: flag.id,
        },
        appContext.accessToken
      );

      if (res.ok) {
        appContext.setIsNotification(true);
        appContext.setNotificationMessage("Circle marked safe.");
        getAllFlags();
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteCircle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchData(
        "/circles/delete",
        "DELETE",
        {
          circle_id: flag.id,
        },
        appContext.accessToken
      );

      if (res.ok) {
        appContext.setIsNotification(true);
        appContext.setNotificationMessage("Circle has been deleted.");
        getAllFlags();
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Link to={`/circle/${flag.id}`} className={styles["link"]}>
      <div className={styles["flag-info"]}>
        <p className={styles["title"]}>{flag.title}</p>
        <div className={styles["secondary-info"]}>
          <p>
            <b>Hosted by: </b>@{flag.username}
          </p>
          <p>
            <b>Description: </b>
            {flag.description}
          </p>
          {flag.is_live ? (
            <p>Live now</p>
          ) : (
            <p>
              <b>Scheduled for:</b> {flag.start_date}
            </p>
          )}
          <p>
            <b>Flagged by:</b> {flag.flag_count} users
          </p>
        </div>
      </div>
      <div className={styles["flag-actions"]}>
        <Button type="button" className="safe-btn" onClick={handleDeleteFlag}>
          Mark as safe
        </Button>
        <Button
          type="button"
          className="delete-btn"
          onClick={handleDeleteCircle}
        >
          Delete Circle
        </Button>
      </div>
    </Link>
  );
};

export default FlagItem;
