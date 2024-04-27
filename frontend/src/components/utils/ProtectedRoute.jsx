import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "../hooks/useFetch";

const ProtectedRoute = (props) => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();

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
          appContext.setLoggedInUser((prevUser) => {
            return { ...prevUser, id: decoded.id, role: decoded.role };
          });
          return true;
        } else {
          throw new Error(res.msg);
        }
      } else {
        throw new Error("no refresh token found");
      }
    } catch (error) {
      appContext.logout();
    }
  };

  const checkAndRefreshToken = async () => {};

  return props.children;
};

export default ProtectedRoute;
