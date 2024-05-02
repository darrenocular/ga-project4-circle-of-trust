import React, { useState, useEffect } from "react";
import styles from "./styles/NotificationBubble.module.css";

const NotificationBubble = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timeout);
  }, []); // Only run this effect once when component mounts

  return (
    <div
      className={
        visible
          ? styles["notification-bubble-visible"]
          : styles["notification-bubble"]
      }
    >
      {message}
    </div>
  );
};

export default NotificationBubble;
