import React, { useCallback, useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaFlag } from "react-icons/fa6";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import styles from "./styles/Circle.module.css";
import Button from "../components/utils/Button";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import { CallLayout } from "../components/stream_components/CallLayout";

const Circle = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const navigate = useNavigate();
  const { circleId } = useParams();
  const [circle, setCircle] = useState({ is_live: true });
  const [tags, setTags] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isFlagged, setIsFlagged] = useState(false);
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [call, setCall] = useState(null);

  const getCircle = async () => {
    try {
      const res = await fetchData(
        "/circles/get",
        "POST",
        {
          circle_id: circleId,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setCircle(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getTags = async () => {
    try {
      const res = await fetchData(
        "/circles/tags",
        "POST",
        {
          circle_id: circleId,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setTags(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getRegisteredUsers = async () => {
    try {
      const res = await fetchData(
        "/circles/registrations",
        "POST",
        {
          circle_id: circleId,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setRegisteredUsers(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!isRegistered) {
        const res = await fetchData(
          "/circles/register",
          "PUT",
          {
            circle_id: circleId,
          },
          appContext.accessToken
        );

        if (res.ok) {
          setIsRegistered(true);
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      } else {
        const res = await fetchData(
          "/circles/register",
          "DELETE",
          {
            circle_id: circleId,
          },
          appContext.accessToken
        );

        if (res.ok) {
          setIsRegistered(false);
          console.log(res.msg);
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getFlagsByCircle = async () => {
    try {
      const res = await fetchData(
        "/circles/flags",
        "POST",
        {
          circle_id: circleId,
        },
        appContext.accessToken
      );

      if (res.ok) {
        setFlags(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFlag = async () => {
    try {
      if (!isFlagged) {
        const res = await fetchData(
          "/circles/flags",
          "PUT",
          {
            circle_id: circleId,
          },
          appContext.accessToken
        );

        if (res.ok) {
          setIsFlagged(true);
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      } else {
        const res = await fetchData(
          "/circles/flag",
          "DELETE",
          {
            circle_id: circleId,
          },
          appContext.accessToken
        );

        if (res.ok) {
          setIsFlagged(false);
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // getstream.io functions
  const loadRoom = useCallback(async () => {
    if (!(appContext.streamClient && appContext.loggedInUser && circleId))
      return;

    setIsLoading(true);
    try {
      const newCall = appContext.streamClient.call("audio_room", circleId);
      await newCall.get();
      setCall(newCall);
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [appContext.streamClient, circleId, appContext.loggedInUser]);

  useEffect(() => {
    loadRoom();
  }, []);

  const handleJoinCircle = async () => {
    console.log("joining");
    // try {
    //   const call = appContext.streamClient.call("audio-room", circleId);
    //   await call.get();
    //   console.log("call is loaded");
    //   // await call.join({ create: false });
    //   setCall(call);
    // } catch (error) {
    //   console.error(error.message);
    // }
  };

  // const handleLeaveCircle = async () => {
  //   try {
  //     const call = appContext.streamClient.call("audio-room", circleId);
  //     await call.leave();
  //     setCall(undefined);
  //     console.log("you have left the call");
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // Get circle details when page loads
  useEffect(() => {
    getCircle();
    getTags();
    getRegisteredUsers();
    getFlagsByCircle();
  }, []);

  // Check if current user has registered for circle
  useEffect(() => {
    for (const user of registeredUsers) {
      if (user.id === appContext.loggedInUser.id) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    }
  }, [registeredUsers]);

  // Check if current user has flagged this circle
  useEffect(() => {
    for (const flag of flags) {
      if (flag.flag_user_id === appContext.loggedInUser.id) {
        setIsFlagged(true);
      } else {
        setIsFlagged(false);
      }
    }
  }, [flags]);

  return (
    <div className={styles["circle-page"]}>
      <div className={styles["circle-info"]}>
        <div className={styles["circle-header"]}>
          <Button
            type="button"
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="arrow-left"></i> Back
          </Button>
          <div className={styles["status-bar"]}>
            {circle["is_live"] ? (
              <>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8b/Red_Circle_full.png"
                  alt="live"
                ></img>
                <span className={styles["live"]}>Live</span>
              </>
            ) : new Date(circle.start_date) >= Date.now() ? (
              <>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Simple_orange_circle.svg/40px-Simple_orange_circle.svg.png?20220311203936"
                  alt="upcoming"
                ></img>
                <span className={styles["upcoming"]}>Upcoming</span>
              </>
            ) : (
              <>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Circle_Davys-Grey_Solid.svg/2048px-Circle_Davys-Grey_Solid.svg.png"
                  alt="ended"
                ></img>
                <span className={styles["ended"]}>Circle ended</span>
              </>
            )}
          </div>
          <p className={styles["title"]}>{circle.title}</p>
        </div>
        <div className={styles["info-panel"]}>
          <div className={styles["tags-container"]}>
            {tags.map((tag, idx) => (
              <div key={idx}>{tag}</div>
            ))}
          </div>
          <Link
            to={`/profile/${circle.host_id}`}
            className={styles["host-container"]}
          >
            <img
              className={styles["host-img"]}
              src={`https://getstream.io/random_svg/?name=${circle.username}`}
            ></img>
            <span className={styles["username"]}>@{circle.username}</span>
            <span className={styles["host-tag"]}>Host</span>
          </Link>
          {!circle["is_live"] && (
            <p className={styles["start-date"]}>
              <b>Scheduled for:</b> {circle.start_date}
            </p>
          )}
          <p>
            <b>Capacity:</b> {circle.participants_limit}
          </p>
          <p>
            <b>Interested:</b> {registeredUsers.length}
          </p>
          <p>
            <b>Description: </b>
            {circle.description}
          </p>
        </div>
        <div className={styles["circle-footer"]}>
          {!isLoading && circle["is_live"] ? (
            <StreamVideo client={appContext.streamClient}>
              <StreamCall call={call}>
                <CallLayout />
              </StreamCall>
            </StreamVideo>
          ) : (
            <p>Thanks for your patience. Circle is not live yet.</p>
          )}
        </div>
      </div>
      <div className={styles["circle-actions"]}>
        {circle["host_id"] !== appContext.loggedInUser.id && (
          <FaFlag
            className={isFlagged ? styles["flag-active"] : styles["flag"]}
            onClick={handleFlag}
          ></FaFlag>
        )}
        {circle["host_id"] !== appContext.loggedInUser.id &&
        !circle["is_live"] ? (
          <>
            <Button
              type="button"
              className={isRegistered ? "register-btn-active" : "register-btn"}
              onClick={handleRegister}
            >
              {isRegistered ? "I'm going!" : "I'm interested!"}
            </Button>
          </>
        ) : (
          isRegistered && (
            <Button
              type="button"
              className="join-btn"
              onClick={handleJoinCircle}
            >
              Join now
            </Button>
          )
        )}
        {circle["host_id"] === appContext.loggedInUser.id &&
          new Date(circle["start_date"]) >= Date.now() && (
            <>
              <Button
                type="button"
                className={circle["is_live"] ? "live-btn-active" : "live-btn"}
              >
                {circle["is_live"] ? "Live now" : "Go live"}
              </Button>
              <Link
                to={`/circle/${circleId}/manage`}
                state={{ circle, existingTags: tags }}
                className={styles["manage-link"]}
              >
                Manage
              </Link>
            </>
          )}
      </div>
    </div>
  );
};

export default Circle;
