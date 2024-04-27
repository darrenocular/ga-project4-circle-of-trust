import React, { Suspense, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import AppContext from "./context/AppContext";
import LoadingSpinner from "./components/utils/LoadingSpinner";
import NavBar from "./components/NavBar";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Explore = React.lazy(() => import("./pages/Explore"));
const Host = React.lazy(() => import("./pages/Host"));
const About = React.lazy(() => import("./pages/About"));
const Profile = React.lazy(() => import("./pages/Profile"));

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    setAccessToken("");
    setLoggedInUser(null);
    setExpirationDate(null);
    if (localStorage.getItem("refreshToken"))
      localStorage.removeItem("refreshToken");
    navigate("/login");
  };

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
            logout,
          }}
        >
          {/* To check credentials (for development only) */}
          <div className="credentials">
            <p>Access token: {accessToken}</p>
            <p>Logged in user: {JSON.stringify(loggedInUser)}</p>
            <p>Expiration date: {JSON.stringify(expirationDate)}</p>
            <p>Refresh token: {localStorage.getItem("refreshToken")}</p>
          </div>
          <div className={styles["layout-wrapper"]}>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  loggedInUser ? <Home /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/explore"
                element={
                  loggedInUser ? <Explore /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/host"
                element={
                  loggedInUser ? <Host /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/about"
                element={
                  loggedInUser ? <About /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/profile"
                element={
                  loggedInUser ? <Profile /> : <Navigate replace to="/login" />
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
