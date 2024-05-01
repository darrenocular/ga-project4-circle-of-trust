import { ParticipantsPanel } from "./ParticipantsPanel";
import { HostControlsPanel, ParticipantsControlsPanel } from "./ControlsPanel";
import { PermissionRequestsPanel } from "./PermissionRequestsPanel";
import styles from "./styles/CallLayout.module.css";

export const CallLayout = ({ isHost, setIsLive }) => {
  return (
    <div className={styles["call-layout"]}>
      <div className={styles["row"]}>
        <ParticipantsPanel />
        {isHost ? (
          <HostControlsPanel setIsLive={setIsLive} />
        ) : (
          <ParticipantsControlsPanel />
        )}
      </div>
      {isHost && <PermissionRequestsPanel />}
    </div>
  );
};
