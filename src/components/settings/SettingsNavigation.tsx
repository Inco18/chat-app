import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SideNav from "../UI/SideNav";
import { ReactComponent as Gear } from "../../assets/gear.svg";
import { ReactComponent as Privacy } from "../../assets/privacy.svg";
import { SettingsNavContext } from "../../context/settingsNavContext";

import styles from "./SettingsNavigation.module.css";

const SettingsNavigation = () => {
  const [generalRef, setGeneralRef] = useState<React.RefObject<unknown>>();
  const [privacyRef, setPrivacyRef] = useState<React.RefObject<unknown>>();
  const settingsRefs = useContext(SettingsNavContext);

  useEffect(() => {
    setGeneralRef(settingsRefs.generalRef);
    setPrivacyRef(settingsRefs.privacyRef);
  }, [settingsRefs]);

  return (
    <SideNav>
      <NavLink
        title="General"
        to={"general"}
        className={({ isActive }) =>
          (isActive ? styles["active"] : "") + " " + styles["navlink"]
        }
        onClick={() =>
          (generalRef?.current as HTMLDivElement).scrollIntoView({
            behavior: "smooth",
          })
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
        onClick={() =>
          (privacyRef?.current as HTMLDivElement).scrollIntoView({
            behavior: "smooth",
          })
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
