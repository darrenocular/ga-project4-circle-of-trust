import { useCall } from "@stream-io/video-react-sdk";
import styles from "./styles/JoinButton.module.css";

export const JoinButton = ({ isInCall, setIsInCall, loadRoom }) => {
  const call = useCall();

  const handleJoinCall = async () => {
    try {
      await call?.join();
      setIsInCall(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLeaveCall = async () => {
    try {
      await call?.leave();
      await loadRoom();
      setIsInCall(false);
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
