import { useState, useEffect } from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import styles from "./styles/JoinButton.module.css";

export const JoinButton = ({ setIsLive }) => {
  const call = useCall();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [isInCall, setIsInCall] = useState(false);

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
      setIsInCall(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (participants.includes(localParticipant)) {
      setIsInCall(true);
    } else {
      setIsInCall(false);
    }
  }, []);

  return (
    <button
      className={isInCall ? styles["join-btn-active"] : styles["join-btn"]}
      onClick={isInCall ? handleLeaveCall : handleJoinCall}
    >
      {isInCall ? "Leave" : "Join"}
    </button>
  );
};
