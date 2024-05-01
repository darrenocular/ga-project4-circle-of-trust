import { useContext } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";
import styles from "./styles/EndCallButton.module.css";
import AppContext from "../../context/AppContext";

export const EndCallButton = ({ isEnded, setIsLive, setIsEnded }) => {
  const call = useCall();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const handleEndCall = async () => {
    try {
      await call?.endCall();
      setIsLive(false);
      setIsEnded(true);
      navigate(`/profile/${appContext.loggedInUser.id}`);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button className={styles["end-call-btn"]} onClick={handleEndCall}>
      End call
    </button>
  );
};
