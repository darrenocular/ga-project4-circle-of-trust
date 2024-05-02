import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";
import styles from "./styles/Login.module.css";
import FormInput from "../components/utils/FormInput";
import Button from "../components/utils/Button";
import GraphicLogo from "../assets/logo/logo-graphic-color.svg";
import WordLogo from "../assets/logo/logo-word-color.svg";
import NotificationBubble from "../components/NotificationBubble";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const fetchData = useFetch();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const handleInputChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (username !== "" && password !== "") {
        const res = await fetchData(
          "/auth/login",
          "POST",
          { username: username, password: password },
          undefined
        );

        if (res.ok) {
          appContext.setAccessToken(res.data["access_token"]);
          const decoded = jwtDecode(res.data["access_token"]);
          const expirationDate = new Date(decoded.exp * 1000);
          appContext.setExpirationDate(expirationDate);
          appContext.setLoggedInUser({
            id: decoded.id,
            role: decoded.role,
            username: decoded.username,
          });
          localStorage.setItem("refreshToken", res.data["refresh_token"]);
          appContext.setIsNotification(true);
          appContext.setNotificationMessage("Logged in successfully.");
        } else {
          throw new Error(res.msg);
        }

        setUsername("");
        setPassword("");
        navigate("/home");
      } else {
        throw new Error("username and password required");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={styles["login"]}>
      <div className={styles["logo-container"]}>
        <img
          src={GraphicLogo}
          alt="graphic-logo"
          className={styles["graphic-logo"]}
        ></img>
        <img
          src={WordLogo}
          alt="word-logo"
          className={styles["word-logo"]}
        ></img>
      </div>
      <form className={styles["form"]}>
        <h1>Log In</h1>
        <div>
          <label htmlFor="username">
            Username/Email<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="text"
            id="username"
            name="username"
            className="short-text"
            onChange={handleInputChange}
            value={username}
            autoFocus
            required
          ></FormInput>
        </div>
        <div>
          <label htmlFor="password">
            Password<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="password"
            id="password"
            name="password"
            className="short-text"
            value={password}
            onChange={handleInputChange}
            required
          ></FormInput>
        </div>
        <Button type="submit" className="submit-btn" onClick={handleLogin}>
          Log in
        </Button>
        <p>
          Don't have an account with us yet?{" "}
          <Link to="/register" className={styles["link"]}>
            Register now
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default Login;
