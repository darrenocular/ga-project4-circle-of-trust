import React, { useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "../../hooks/useFetch";

const ProtectedRoute = (props) => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const res = await fetchData(
          "/auth/refresh",
          "POST",
          undefined,
          refreshToken
        );

        if (res.ok) {
          appContext.setAccessToken(res.data["access_token"]);
          const decoded = jwtDecode(res.data["access_token"]);
          const expirationDate = new Date(decoded.exp * 1000);
          appContext.setExpirationDate(expirationDate);
          appContext.setLoggedInUser({
            username: decoded.username,
            id: decoded.id,
            role: decoded.role,
          });
        } else {
          throw new Error(res.msg); // if refresh token has expired
        }
      } else {
        throw new Error("no refresh token found"); // if no refresh token is found
      }
    } catch (error) {
      appContext.logout();
    }
  };

  // To protect admin pages
  useEffect(() => {
    if (
      props.requiredRole &&
      appContext.loggedInUser.role !== props.requiredRole
    ) {
      console.error("no permission to access page");
      navigate("/home");
    }
  }, [props.requiredRole, appContext.loggedInUser]);

  // useEffect(() => {
  //   refreshAccessToken();
  // }, []);

  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error(error.message);
      }
    };

    // Check every 5 min to see if access token has expired/is expiring
    const interval = setInterval(() => {
      if (
        appContext.loggedInUser &&
        appContext.accessToken &&
        appContext.expirationDate - Date.now() <= 5 * 60 * 1000
      ) {
        refresh();
      }
    }, 5 * 60 * 1000);

    refreshAccessToken();

    return () => clearInterval(interval);
  }, []);

  if (
    (appContext.expirationDate && appContext.expirationDate < Date.now()) ||
    !appContext.accessToken
  )
    return <Navigate replace to="/login" />;

  return props.children;
};

export default ProtectedRoute;
