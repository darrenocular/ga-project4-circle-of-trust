import { useContext } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import styles from "./styles/JoinButton.module.css";
import AppContext from "../../context/AppContext";

export const JoinButton = ({ isInCall, setIsInCall, loadRoom }) => {
  const appContext = useContext(AppContext);
  const call = useCall();

  const handleJoinCall = async () => {
    try {
      await call?.join();
      setIsInCall(true);
      appContext.setIsNotification(true);
      appContext.setNotificationMessage("You have joined the Circle.");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLeaveCall = async () => {
    try {
      await call?.leave();
      await loadRoom();
      setIsInCall(false);
      appContext.setIsNotification(true);
      appContext.setNotificationMessage("You have left the Circle.");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button
      className={isInCall ? styles["join-btn-active"] : styles["join-btn"]}
      onClick={isInCall ? handleLeaveCall : handleJoinCall}
    >
      {isInCall ? "Leave" : "Join"}
    </button>
  );
};
