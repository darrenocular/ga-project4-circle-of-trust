import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "../hooks/useFetch";

const ProtectedRoute = (props) => {
  const appContext = useContext(AppContext);
  const fetchData = useFetch();

  const refreshToken = async () => {};

  const checkAndRefreshToken = async () => {};

  return props.children;
};

export default ProtectedRoute;
