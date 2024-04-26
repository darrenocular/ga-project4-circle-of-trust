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

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [dp, setDp] = useState("");
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

  const handleRegister = (e) => {
    e.preventDefault();
  };

  const handleClearForm = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles["register"]}>
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
        <h1>Register</h1>
        {username}
        {password}
        <div>
          <label htmlFor="username">
            Username<span className={styles["required"]}>*</span>
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
          <label htmlFor="email">
            Email<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="text"
            id="email"
            name="email"
            className="short-text"
            onChange={handleInputChange}
            value={email}
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
        <div>
          <label htmlFor="dob">
            Date of birth<span className={styles["required"]}>*</span>
          </label>
          <FormInput
            type="date"
            id="dob"
            name="dob"
            className="short-text"
            value={birthDate}
            onChange={handleInputChange}
            required
          ></FormInput>
        </div>
        <div>
          <label htmlFor="bio">
            Your bio<span className={styles["required"]}>*</span>
          </label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            className="bio"
            rows="4"
            value={bio}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="dp">Upload a profile picture</label>
          <FormInput
            type="file"
            id="dp"
            name="dp"
            className="file-upload"
            value={dp}
            onChange={handleInputChange}
            required
          ></FormInput>
        </div>
        <div>
          <Button type="submit" className="login-btn" onClick={handleRegister}>
            Register
          </Button>
          <Button type="button" className="login-btn" onClick={handleClearForm}>
            Clear form
          </Button>
        </div>
        <p>
          Already have an account?{" "}
          <Link to="/login" className={styles["link"]}>
            Log in now
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default Register;
