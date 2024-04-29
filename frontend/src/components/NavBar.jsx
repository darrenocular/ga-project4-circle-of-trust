import React, { useContext } from "react";
import styles from "./styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import AppContext from "../context/AppContext";
import FullLogo from "../assets/logo/logo-full-color.svg";
import Button from "../components/utils/Button";

const NavBar = () => {
  const appContext = useContext(AppContext);

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
          {appContext.loggedInUser.role === "admin" ? (
            <NavLink
              to="/circles/manage"
              className={(navData) =>
                navData.isActive ? styles["link-active"] : styles["link"]
              }
            >
              Manage Flags
            </NavLink>
          ) : (
            <NavLink
              to="/about"
              className={(navData) =>
                navData.isActive ? styles["link-active"] : styles["link"]
              }
            >
              About
            </NavLink>
          )}
        </div>
      </div>
      <div className={styles["nav-footer"]}>
        {appContext.loggedInUser.role !== "admin" ? (
          <NavLink
            to={`/profile/${appContext.loggedInUser.id}`}
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
        ) : (
          <div className={styles["admin-profile"]}>
            <img
              className={styles["profile-pic"]}
              src={`https://getstream.io/random_svg/?name=${appContext.loggedInUser.username}`}
            ></img>
            <span>@{appContext.loggedInUser.username}</span>
          </div>
        )}

        <Button
          type="submit"
          className="logout-btn"
          onClick={appContext.logout}
        >
          Log out
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
