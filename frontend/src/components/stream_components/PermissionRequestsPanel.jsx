import { useCall } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState, useContext } from "react";
import styles from "./styles/PermissionRequestsPanel.module.css";
import Button from "../utils/Button";
import AppContext from "../../context/AppContext";

export const PermissionRequestsPanel = () => {
  const appContext = useContext(AppContext);
  // this hook will take the call instance from the <StreamCall /> context.
  const call = useCall();
  const [permissionRequests, setPermissionRequests] = useState([]);

  useEffect(() => {
    return call?.on("call.permission_request", (event) => {
      const request = event;
      setPermissionRequests((reqs) => [...reqs, request]);
    });
  }, [call]);

  const handlePermissionRequest = useCallback(
    async (request, accept) => {
      const { user, permissions } = request;
      try {
        if (accept) {
          await call?.grantPermissions(user.id, permissions);
          appContext.setIsNotification(true);
          appContext.setNotificationMessage("Speaker permission granted.");
        } else {
          await call?.revokePermissions(user.id, permissions);
          appContext.setIsNotification(true);
          appContext.setNotificationMessage("Speaker permission denied.");
        }
        setPermissionRequests((reqs) => reqs.filter((req) => req !== request));
      } catch (err) {
        console.error(`Error granting or revoking permissions`, err);
      }
    },
    [call]
  );

  // if (!permissionRequests.length) return null;

  return (
    <div className={styles["permissions-panel"]}>
      <p className={styles["permissions-header"]}>Permission Requests</p>
      {permissionRequests.length > 0 ? (
        permissionRequests.map((request) => (
          <div className={styles["permission-request"]} key={request.user.id}>
            <span>
              {request.user.name} requested to {request.permissions.join(", ")}
            </span>
            <div className={styles["btn-container"]}>
              <Button
                className="approve-btn"
                onClick={() => handlePermissionRequest(request, true)}
              >
                Approve
              </Button>
              <Button
                className="deny-btn"
                onClick={() => handlePermissionRequest(request, false)}
              >
                Deny
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className={styles["notification-bar"]}>
          No permission requests at the moment.
        </p>
      )}
    </div>
  );
};
