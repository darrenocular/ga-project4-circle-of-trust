import { Avatar } from "@stream-io/video-react-sdk";

export const MyParticipant = ({ participant }) => {
  // `isSpeaking` information is available on the participant object,
  // and it is automatically detected by our system and updated by our SDK.
  const { isSpeaking } = participant;
  return (
    <div className={`participant ${isSpeaking ? "speaking" : ""}`}>
      <Avatar imageSrc={participant.image} />
      <div className="name">{participant.name}</div>
    </div>
  );
};
