import React, { Suspense, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppContext from "./context/AppContext";
import LoadingSpinner from "./components/utils/LoadingSpinner";

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [expirationDate, setExpirationDate] = useState("");

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
          }}
        >
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
            <Route path="/home" element={<Home />} />
          </Routes>
        </AppContext.Provider>
      </Suspense>
    </>
  );
};

export default App;
