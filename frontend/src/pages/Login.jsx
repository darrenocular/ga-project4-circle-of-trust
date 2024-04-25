import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Login.module.css";
import FormInput from "../components/utils/FormInput";
import Button from "../components/utils/Button";
import GraphicLogo from "../assets/logo/logo-graphic-color.svg";
import WordLogo from "../assets/logo/logo-word-color.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
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
        {username}
        {password}
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
        <Button type="submit" className="login-btn" onClick={handleLogin}>
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
