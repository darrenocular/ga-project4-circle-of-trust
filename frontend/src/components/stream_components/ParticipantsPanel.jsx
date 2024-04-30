import {
  ParticipantsAudio,
  SfuModels,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Participant } from "./Participant";

export const ParticipantsPanel = () => {
  const hasAudio = (p) => p.publishedTracks.includes(SfuModels.TrackType.AUDIO);

  const { useParticipants } = useCallStateHooks();
  // whenever a participant receives an update, this hook will re-render
  // this component with the updated list of participants, ensuring that
  // the UI is always in sync with the call state.
  const participants = useParticipants();
  const speakers = participants.filter((p) => hasAudio(p));
  const listeners = participants.filter((p) => !hasAudio(p));

  return (
    <>
      <h4>Speakers</h4>
      <ParticipantsAudio participants={speakers} />
      <div className="participants-panel">
        {speakers.map((p) => (
          <Participant participant={p} key={p.sessionId} />
        ))}
      </div>
      <h4>Listeners</h4>
      <div className="participants-panel">
        {listeners.map((p) => (
          <Participant participant={p} key={p.sessionId} />
        ))}
      </div>
    </>
  );
};
