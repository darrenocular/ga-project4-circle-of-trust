import { MicButton } from "./MicButton";
import { LiveButton } from "./LiveButton";
import styles from "./styles/ControlsPanel.module.css";

export const ControlsPanel = () => {
  return (
    <div className={styles["controls-panel"]}>
      <MicButton />
      <LiveButton />
    </div>
  );
};
