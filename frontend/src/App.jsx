import React, { Suspense, useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import AppContext from "./context/AppContext";
import LoadingSpinner from "./components/utils/LoadingSpinner";
import NavBar from "./components/NavBar";
import NotificationBubble from "./components/NotificationBubble";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import { StreamVideoClient } from "@stream-io/video-react-sdk";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Explore = React.lazy(() => import("./pages/Explore"));
const Host = React.lazy(() => import("./pages/Host"));
const About = React.lazy(() => import("./pages/About"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Circle = React.lazy(() => import("./pages/Circle"));
const ManageFlags = React.lazy(() => import("./pages/ManageFlags"));
const ManageCircle = React.lazy(() => import("./pages/ManageCircle"));

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [streamClient, setStreamClient] = useState(undefined);
  const [isNotification, setIsNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    setAccessToken("");
    setLoggedInUser(null);
    setExpirationDate(null);
    if (localStorage.getItem("refreshToken"))
      localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // Set up for getstream.io
  useEffect(() => {
    if (!loggedInUser) return;

    const streamApiKey = import.meta.env.VITE_STREAM_API_KEY;

    // Initialize stream user
    const streamUser = {
      id: loggedInUser.username,
      name: loggedInUser.username,
      image: `https://getstream.io/random_svg/?name=${loggedInUser.username}`,
    };

    const tokenProvider = async () => {
      const { token } = await fetch(
        "https://pronto.getstream.io/api/auth/create-token?" +
          new URLSearchParams({
            api_key: streamApiKey,
            user_id: loggedInUser.username,
          })
      ).then((res) => res.json());

      return token;
    };

    setStreamClient(
      new StreamVideoClient({
        apiKey: streamApiKey,
        user: streamUser,
        tokenProvider,
      })
    );

    return () => {
      streamClient
        ?.disconnectUser()
        .catch((error) => console.log(`cannot disconnect user`, error));
      setStreamClient(undefined);
    };
  }, [loggedInUser]);

  // Listens for notifications
  useEffect(() => {
    if (isNotification) {
      const timeout = setTimeout(() => {
        setIsNotification(false);
        setNotificationMessage("");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isNotification]);

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <AppContext.Provider
          value={{
            accessToken,
            setAccessToken,
            loggedInUser,
            setLoggedInUser,
            expirationDate,
            setExpirationDate,
            streamClient,
            setStreamClient,
            isNotification,
            setIsNotification,
            notificationMessage,
            setNotificationMessage,
            logout,
          }}
        >
          <div className={styles["layout-wrapper"]}>
            {isNotification && (
              <NotificationBubble message={notificationMessage} />
            )}
            {loggedInUser && <NavBar />}
            <Routes>
              <Route
                path="/"
                element={
                  loggedInUser ? (
                    <Navigate replace to="/home" />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  loggedInUser ? <Navigate replace to="/home" /> : <Login />
                }
              />
              <Route
                path="/register"
                element={
                  loggedInUser ? <Navigate replace to="/home" /> : <Register />
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host"
                element={
                  <ProtectedRoute>
                    <Host />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/circle/:circleId"
                element={
                  <ProtectedRoute>
                    <Circle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/circle/:circleId/manage"
                element={
                  <ProtectedRoute>
                    <ManageCircle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/circles/manage"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ManageFlags />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AppContext.Provider>
      </Suspense>
    </>
  );
};

export default App;
