import { MicButton } from "./MicButton";
import { LiveButton } from "./LiveButton";
import { JoinButton } from "./JoinButton";
import { RequestButton } from "./RequestButton";
import { useState, useEffect } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import styles from "./styles/ControlsPanel.module.css";

export const HostControlsPanel = ({ setIsLive, loadRoom }) => {
  return (
    <div className={styles["controls-panel"]}>
      <MicButton />
      <LiveButton setIsLive={setIsLive} loadRoom={loadRoom} />
    </div>
  );
};

export const ParticipantsControlsPanel = ({ loadRoom }) => {
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [isInCall, setIsInCall] = useState(false);

  useEffect(() => {
    if (participants.includes(localParticipant)) {
      setIsInCall(true);
    } else {
      setIsInCall(false);
    }
  }, []);

  return (
    <div className={styles["controls-panel"]}>
      <JoinButton
        isInCall={isInCall}
        setIsInCall={setIsInCall}
        loadRoom={loadRoom}
      />
      {isInCall && <RequestButton />}
    </div>
  );
};
