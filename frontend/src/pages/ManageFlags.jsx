import React, { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/ManageFlags.module.css";
import AppContext from "../context/AppContext";
import FlagItem from "../components/FlagItem";

const ManageFlags = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const [allFlags, setAllFlags] = useState([]);

  const getAllFlags = async () => {
    try {
      const res = await fetchData(
        "/circles/flags",
        "GET",
        undefined,
        appContext.accessToken
      );

      if (res.ok) {
        setAllFlags(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //   Get all flags when page loads
  useEffect(() => {
    getAllFlags();
  }, []);

  return (
    <div className={styles["flags-page"]}>
      <div className={styles["flags-header"]}>
        Manage <span>Flags</span>
      </div>
      <div className={styles["flags-section"]}>
        {allFlags.length > 0 ? (
          allFlags.map((flag) => (
            <FlagItem flag={flag} key={flag.id} getAllFlags={getAllFlags} />
          ))
        ) : (
          <span>We're safe! No flags found.</span>
        )}
      </div>
      <div className="flags-footer"></div>
    </div>
  );
};

export default ManageFlags;
