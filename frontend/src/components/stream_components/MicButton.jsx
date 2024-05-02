import { useContext } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import styles from "./styles/MicButton.module.css";
import AppContext from "../../context/AppContext";

export const MicButton = () => {
  const appContext = useContext(AppContext);
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  return (
    <>
      <button
        className={isMute ? styles["mute-btn-active"] : styles["mute-btn"]}
        onClick={async () => {
          if (isMute) {
            await microphone.enable();
            appContext.setIsNotification(true);
            appContext.setNotificationMessage("Your sound is on.");
          } else {
            await microphone.disable();
            appContext.setIsNotification(true);
            appContext.setNotificationMessage("You are on mute.");
          }
        }}
      >
        {isMute ? "Unmute" : "Mute"}
      </button>

      {/* <button onClick={() => microphone.toggle()}>
      {isMute ? 'Turn on microphone' : 'Turn off microphone'}
    </button> */}
    </>
  );
};
