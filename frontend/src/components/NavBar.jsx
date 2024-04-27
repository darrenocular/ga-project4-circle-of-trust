import React, { useContext } from "react";
import styles from "./styles/NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import FullLogo from "../assets/logo/logo-full-color.svg";
import Button from "../components/utils/Button";

const NavBar = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    appContext.setAccessToken("");
    appContext.setLoggedInUser(null);
    appContext.setExpirationDate(null);
    if (localStorage.getItem("refreshToken"))
      localStorage.removeItem("refreshToken");
    navigate("/login");
  };

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
      <div className={styles["nav-footer"]}>
        <NavLink
          to="/profile"
          className={(navData) =>
            navData.isActive ? styles["profile-active"] : styles["profile"]
          }
        >
          <img
            className={styles["profile-pic"]}
            src={`https://getstream.io/random_svg/?name=${appContext.loggedInUser.username}`}
          ></img>
          <span>@{appContext.loggedInUser.username}</span>
        </NavLink>
        <Button type="submit" className="logout-btn" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
