import { MicButton } from "./MicButton";
import { LiveButton } from "./LiveButton";
import { JoinButton } from "./JoinButton";
import styles from "./styles/ControlsPanel.module.css";

export const HostControlsPanel = ({ setIsLive }) => {
  return (
    <div className={styles["controls-panel"]}>
      <MicButton />
      <LiveButton setIsLive={setIsLive} />
    </div>
  );
};

export const ParticipantsControlsPanel = () => {
  return (
    <div className={styles["controls-panel"]}>
      <JoinButton />
    </div>
  );
};
