import React, { useContext } from "react";
import styles from "./styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import AppContext from "../context/AppContext";
import FullLogo from "../assets/logo/logo-full-color.svg";
import Button from "../components/utils/Button";

const NavBar = () => {
  const appContext = useContext(AppContext);

  const handleLogout = () => {};

  return (
    <nav className={styles["nav"]}>
      <div>
        <img
          src={FullLogo}
          alt="full-logo"
          className={styles["full-logo"]}
        ></img>
        <div className={styles["links-container"]}>
          <NavLink
            to="/home"
            className={(navData) =>
              navData.isActive ? styles["link-active"] : styles["link"]
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={(navData) =>
              navData.isActive ? styles["link-active"] : styles["link"]
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/host"
            className={(navData) =>
              navData.isActive ? styles["link-active"] : styles["link"]
            }
          >
            Host
          </NavLink>
          <NavLink
            to="/about"
            className={(navData) =>
              navData.isActive ? styles["link-active"] : styles["link"]
            }
          >
            About
          </NavLink>
        </div>
      </div>
      <div>
        {appContext.loggedInUser.username}
        <Button type="submit" className="logout-btn" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
