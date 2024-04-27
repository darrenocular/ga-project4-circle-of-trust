import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
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

  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "username":
        setUsername(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "dob":
        setBirthDate(e.target.value);
        break;
      case "bio":
        setBio(e.target.value);
        break;
      case "dp":
        setDp(e.target.value);
        break;
    }
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    setUsername("");
    setEmail("");
    setPassword("");
    setBirthDate("");
    setBio("");
    setDp("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (username && email && password && birthDate && bio) {
        const res = await fetchData(
          "/auth/register",
          "PUT",
          {
            username,
            email,
            password,
            date_of_birth: birthDate,
            bio,
            // dp
          },
          undefined
        );

        if (res.ok) {
          handleClearForm(e);
          navigate("/login");
        } else {
          throw new Error(
            typeof res.msg === "object" ? JSON.stringify(res.msg) : res.msg
          );
        }
      } else {
        throw new Error("incomplete fields");
      }
    } catch (error) {
      console.error(error.message);
    }
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
            id="bio"
            name="bio"
            className={styles["bio"]}
            rows="4"
            value={bio}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="dp">Profile picture</label>
          <input
            type="file"
            id="dp"
            name="dp"
            className={styles["file-upload"]}
            value={dp}
            onChange={handleInputChange}
            required
          ></input>
        </div>
        <div>
          <Button type="button" className="clear-btn" onClick={handleClearForm}>
            Clear form
          </Button>
          <Button type="submit" className="submit-btn" onClick={handleRegister}>
            Register
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
