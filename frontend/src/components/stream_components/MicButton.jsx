import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import styles from "./styles/MicButton.module.css";

export const MicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  return (
    <>
      <button
        className={isMute ? styles["mute-btn-active"] : styles["mute-btn"]}
        onClick={async () => {
          if (isMute) {
            await microphone.enable();
          } else {
            await microphone.disable();
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
