import React, { useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import styles from "./styles/Profile.module.css";
import AppContext from "../context/AppContext";
import { useParams } from "react-router-dom";
import Button from "../components/utils/Button";
import CircleCard from "../components/CircleCard";

const Profile = () => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [userHostedCircles, setUserHostedCircles] = useState([]);
  const [userScheduledCircles, setUserScheduledCircles] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [usersFollowing, setUsersFollowing] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

  const getUserDetails = async () => {
    try {
      const res = await fetchData(
        "/auth/user",
        "POST",
        { user_id: userId },
        appContext.accessToken
      );

      if (res.ok) {
        setUser(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUserCircles = async () => {
    try {
      const res = await fetchData(
        "/circles/user",
        "POST",
        { host_id: userId },
        appContext.accessToken
      );

      if (res.ok) {
        setUserHostedCircles(
          res.data.filter(
            (circle) =>
              circle.is_ended || new Date(circle.start_date) <= Date.now()
          )
        );
        setUserScheduledCircles(
          res.data.filter(
            (circle) =>
              !circle.is_ended && new Date(circle.start_date) > Date.now()
          )
        );
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUserFollowers = async () => {
    try {
      const res = await fetchData(
        "/user/followers",
        "POST",
        { user_id: userId },
        appContext.accessToken
      );

      if (res.ok) {
        setUserFollowers(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUsersFollowing = async () => {
    try {
      const res = await fetchData(
        "/user/following",
        "POST",
        { follower_id: userId },
        appContext.accessToken
      );

      if (res.ok) {
        setUsersFollowing(res.data);
      } else {
        throw new Error(
          typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    try {
      if (!isFollowed) {
        const res = await fetchData(
          "/user/follow",
          "PUT",
          {
            user_id: userId,
            follower_id: appContext.loggedInUser.id,
          },
          appContext.accessToken
        );

        if (res.ok) {
          setIsFollowed(true);
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      } else {
        const res = await fetchData(
          "/user/follow",
          "DELETE",
          {
            user_id: userId,
            follower_id: appContext.loggedInUser.id,
          },
          appContext.accessToken
        );

        if (res.ok) {
          setIsFollowed(false);
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

  // Get all user information when page loads
  useEffect(() => {
    getUserDetails();
    getUserCircles();
    getUserFollowers();
    getUsersFollowing();
  }, [userId]);

  useEffect(() => {
    getUserFollowers();
    getUsersFollowing();
  }, [isFollowed]);

  useEffect(() => {
    for (const follower of userFollowers) {
      if (follower.id == appContext.loggedInUser.id) setIsFollowed(true);
    }
  }, [userFollowers]);

  return (
    <div className={styles["profile-page"]}>
      <div className={styles["profile-header"]}>
        <p>
          Your <span>Profile</span>
        </p>
      </div>
      <div className={styles["profile-container"]}>
        <img
          className={styles["host-img"]}
          src={`https://getstream.io/random_svg/?name=${user.username}`}
        ></img>
        <div className={styles["profile-info"]}>
          <p className={styles["username"]}>
            @<span>{user.username}</span>
          </p>
          <div className={styles["statistics"]}>
            <div>{userHostedCircles.length} Circle(s) hosted</div>
            <div>{userFollowers.length} Followers</div>
            <div>{usersFollowing.length} Following</div>
          </div>
          <p className={styles["bio"]}>{user.bio}</p>
          {appContext.loggedInUser.id != userId && (
            <Button
              className={isFollowed ? "follow-btn-active" : "follow-btn"}
              type="button"
              onClick={handleFollow}
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      <div className={styles["profile-section"]}>
        <p className={styles["section-header"]}>Upcoming</p>
        <div className={styles["section-body"]}>
          {userScheduledCircles.length > 0 ? (
            userScheduledCircles.map((circle, idx) => (
              <CircleCard circle={circle} isLive={circle.is_live} key={idx} />
            ))
          ) : (
            <p className={styles["notification-bar"]}>
              No scheduled Circles at the moment.
            </p>
          )}
        </div>
      </div>
      <div className={styles["profile-section"]}>
        <p className={styles["section-header"]}>Archives</p>
        <div className={styles["section-body"]}>
          {userHostedCircles.length > 0 ? (
            userHostedCircles.map((circle, idx) => (
              <CircleCard circle={circle} isEnded={circle.is_ended} key={idx} />
            ))
          ) : (
            <p className={styles["notification-bar"]}>No hosted Circles yet.</p>
          )}
        </div>
      </div>
      <div className={styles["profile-footer"]}></div>
    </div>
  );
};

export default Profile;
