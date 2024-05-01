import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import styles from "./styles/LiveButton.module.css";

export const LiveButton = ({ setIsLive, loadRoom }) => {
  // this utility hook returns the call object from the <StreamCall /> context
  const call = useCall();
  // will emit a new value whenever the call goes live or stops being live.
  // we can use it to update the button text or adjust any other UI elements
  const { useIsCallLive } = useCallStateHooks();
  const isLive = useIsCallLive();

  return (
    <button
      className={isLive ? styles["live-btn-active"] : styles["live-btn"]}
      onClick={async () => {
        if (isLive) {
          await call?.leave();
          await call?.stopLive();
          await loadRoom();
          setIsLive(false);
        } else {
          await call?.goLive();
          await call?.join();
          setIsLive(true);
        }
      }}
    >
      {isLive ? "Live now" : "Go live"}
    </button>
  );
};
