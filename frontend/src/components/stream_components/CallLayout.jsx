import { ParticipantsPanel } from "./ParticipantsPanel";
import { ControlsPanel } from "./ControlsPanel";
import { PermissionRequestsPanel } from "./PermissionRequestsPanel";
import styles from "./styles/CallLayout.module.css";

export const CallLayout = () => {
  return (
    <div className={styles["call-layout"]}>
      <div className={styles["row"]}>
        <ParticipantsPanel />
        <ControlsPanel />
      </div>
      <PermissionRequestsPanel />
    </div>
  );
};
