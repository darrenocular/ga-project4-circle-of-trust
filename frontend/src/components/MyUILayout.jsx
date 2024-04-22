import { MyDescriptionPanel } from "./MyDescriptionPanel";
import { MyParticipantsPanel } from "./MyParticipantsPanel";
import { MyControlsPanel } from "./MyControlsPanel";
import { MyPermissionRequestsPanel } from "./MyPermissionRequestsPanel";

export const MyUILayout = () => {
  return (
    <div className="ui-layout">
      <MyDescriptionPanel />
      <MyParticipantsPanel />
      <MyPermissionRequestsPanel />
      <MyControlsPanel />
    </div>
  );
};
