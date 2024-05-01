import { useState, useEffect, useCallback } from "react";
import {
  OwnCapability,
  useCall,
  useCallStateHooks,
  SfuModels,
  useConnectedUser,
} from "@stream-io/video-react-sdk";
import styles from "./styles/RequestButton.module.css";

export const RequestButton = ({ isInCall, loadRoom }) => {
  const call = useCall();
  const { useCallCustomData, useHasPermissions, useLocalParticipant } =
    useCallStateHooks();
  const customData = useCallCustomData();
  const connectedUser = useConnectedUser();
  const localParticipant = useLocalParticipant();
  const canSendAudio = useHasPermissions(OwnCapability.SEND_AUDIO);
  const canRequestSpeakingPermissions = call?.permissionsContext.canRequest(
    OwnCapability.SEND_AUDIO
  );
  const [isAwaitingAudioApproval, setIsAwaitingAudioApproval] = useState(false);

  const isSpeaker = customData.speakerIds?.some(
    (id) => id === connectedUser?.id
  );

  const isAudioMute = !localParticipant?.publishedTracks.includes(
    SfuModels.TrackType.AUDIO
  );

  const toggleAudio = useCallback(async () => {
    if (!call) return;

    if (!canSendAudio) {
      setIsAwaitingAudioApproval(true);
      await call
        .requestPermissions({
          permissions: [OwnCapability.SEND_AUDIO],
        })
        .catch((reason) => {
          console.log("RequestPermissions failed", reason);
        });
    } else {
      await call.microphone.toggle().catch((err) => {
        console.log("toggleAudio failed", err);
      });
    }
  }, [call, canSendAudio]);

  useEffect(() => {
    if (!(call && connectedUser)) return;
    return call.on("call.permissions_updated", (event) => {
      if (connectedUser.id !== event.user.id) return;
      if (event.own_capabilities.includes(OwnCapability.SEND_AUDIO)) {
        call.microphone.enable().catch((err) => {
          console.log("enable microphone failed", err);
        });
      } else {
        call.microphone.disable().catch((err) => {
          console.log("disable microphone failed", err);
        });
      }
    });
  }, [call, connectedUser]);

  useEffect(() => {
    if (canSendAudio) {
      setIsAwaitingAudioApproval(false);
    }
  }, [canSendAudio]);

  const showMuteButton =
    canSendAudio || (canRequestSpeakingPermissions && isSpeaker);

  return (
    <div className={styles["btn-container"]}>
      {showMuteButton && (
        <button
          className={
            isAudioMute ? styles["request-btn-active"] : styles["request-btn"]
          }
          disabled={isAwaitingAudioApproval}
          onClick={toggleAudio}
          title={isAudioMute ? "Unmute" : "Mute"}
        >
          {isAwaitingAudioApproval
            ? "Awaiting approval..."
            : isAudioMute
            ? "Unmute"
            : "Mute"}
        </button>
      )}
      {!showMuteButton && (
        <button
          className={styles["request-btn"]}
          disabled={isAwaitingAudioApproval}
          title="Request to speak"
          onClick={() => {
            setIsAwaitingAudioApproval(true);
            call.requestPermissions({
              permissions: [OwnCapability.SEND_AUDIO],
            });
          }}
        >
          Request to speak
        </button>
      )}
      {isAwaitingAudioApproval && (
        <p className={styles["notification-bar"]}>
          Waiting for permission to speak...
        </p>
      )}
    </div>
  );
};
