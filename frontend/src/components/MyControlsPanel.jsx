import { MyMicButton } from "./MyMicButton";
import { MyLiveButton } from "./MyLiveButton";

export const MyControlsPanel = () => {
  return (
    <div className="controls-panel">
      <MyMicButton />
      <MyLiveButton />
    </div>
  );
};
