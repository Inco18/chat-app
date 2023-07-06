import React from "react";
import { NavLink } from "react-router-dom";
import SideNav from "../UI/SideNav";
import { ReactComponent as Gear } from "../../assets/gear.svg";
import { ReactComponent as Privacy } from "../../assets/privacy.svg";

import styles from "./SettingsNavigation.module.css";

const SettingsNavigation = () => {
  return (
    <SideNav>
      <NavLink
        title="General"
        to={"general"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Gear className={styles.icon} />
          General
        </div>
      </NavLink>
      <NavLink
        title="Privacy"
        to={"privacy"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
      >
        <div className={styles.left}>
          <Privacy className={styles.icon} />
          Privacy
        </div>
      </NavLink>
    </SideNav>
  );
};

export default SettingsNavigation;
