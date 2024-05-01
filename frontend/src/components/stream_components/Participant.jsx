import { Avatar } from "@stream-io/video-react-sdk";
import styles from "./styles/Participant.module.css";

export const Participant = ({ participant }) => {
  // `isSpeaking` information is available on the participant object,
  // and it is automatically detected by our system and updated by our SDK.
  const { isSpeaking } = participant;
  return (
    <div className={styles["participant"]}>
      <Avatar imageSrc={participant.image} />
      <p className={styles["name"]}>{participant.name}</p>
    </div>
  );
};
