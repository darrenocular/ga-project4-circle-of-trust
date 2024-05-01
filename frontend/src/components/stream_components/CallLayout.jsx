import { ParticipantsPanel } from "./ParticipantsPanel";
import { HostControlsPanel, ParticipantsControlsPanel } from "./ControlsPanel";
import { PermissionRequestsPanel } from "./PermissionRequestsPanel";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import styles from "./styles/CallLayout.module.css";

export const CallLayout = ({ isHost, setIsLive, loadRoom }) => {
  return (
    <div className={styles["call-layout"]}>
      <div className={styles["row"]}>
        <ParticipantsPanel />
        {isHost ? (
          <HostControlsPanel setIsLive={setIsLive} loadRoom={loadRoom} />
        ) : (
          <ParticipantsControlsPanel loadRoom={loadRoom} />
        )}
      </div>
      {isHost && <PermissionRequestsPanel />}
    </div>
  );
};
