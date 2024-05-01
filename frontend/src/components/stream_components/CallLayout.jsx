import { ParticipantsPanel } from "./ParticipantsPanel";
import { HostControlsPanel, ParticipantsControlsPanel } from "./ControlsPanel";
import { PermissionRequestsPanel } from "./PermissionRequestsPanel";
import styles from "./styles/CallLayout.module.css";

export const CallLayout = ({ setIsEnded, isHost, setIsLive, loadRoom }) => {
  return (
    <div className={styles["call-layout"]}>
      <div className={styles["row"]}>
        <ParticipantsPanel />
        {isHost ? (
          <HostControlsPanel
            setIsEnded={setIsEnded}
            setIsLive={setIsLive}
            loadRoom={loadRoom}
          />
        ) : (
          <ParticipantsControlsPanel loadRoom={loadRoom} />
        )}
      </div>
      {isHost && <PermissionRequestsPanel />}
    </div>
  );
};
