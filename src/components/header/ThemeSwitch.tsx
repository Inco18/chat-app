import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as Moon } from "../../assets/moon.svg";
import { ReactComponent as Sun } from "../../assets/sun.svg";

import styles from "./ThemeSwitch.module.css";
import { ThemeContext } from "../../context/theme-context";

const ThemeSwitch = () => {
  const [switchTransitonEnabled, setSwitchTransitionEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSwitchTransitionEnabled(true);
    }, 100);
  }, []);
  const themectx = useContext(ThemeContext);
  return (
    <div className={styles.track} onClick={themectx.switchTheme}>
      <div
        className={`${styles.circle} ${
          switchTransitonEnabled ? styles.transition : ""
        }`}
        style={
          themectx.theme === "light"
            ? { transform: "translateX(calc(-100% + 9px))" }
            : {}
        }
      >
        <Sun
          className={`${styles.icon} ${
            switchTransitonEnabled ? styles.transition : ""
          }`}
          style={themectx.theme === "light" ? { opacity: 1 } : { opacity: 0 }}
        />
        <Moon
          className={`${styles.icon} ${
            switchTransitonEnabled ? styles.transition : ""
          }`}
          style={themectx.theme === "dark" ? { opacity: 1 } : { opacity: 0 }}
        />
      </div>
    </div>
  );
};

export default ThemeSwitch;
