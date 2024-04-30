import { DescriptionPanel } from "./DescriptionPanel";
import { ParticipantsPanel } from "./ParticipantsPanel";
import { ControlsPanel } from "./ControlsPanel";
import { PermissionRequestsPanel } from "./PermissionRequestsPanel";

export const CallLayout = () => {
  return (
    <div>
      <DescriptionPanel />
      <ParticipantsPanel />
      <PermissionRequestsPanel />
      <ControlsPanel />
    </div>
  );
};
