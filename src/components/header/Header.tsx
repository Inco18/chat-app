import React from "react";

import styles from "./Header.module.css";
import Logo from "./Logo";
import MainNavigation from "./MainNavigation";
import Notifications from "./Notifications";
import Profile from "./Profile";
import ThemeSwitch from "./ThemeSwitch";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.leftBlock}>
        <Logo />
        <MainNavigation />
      </div>
      <div className={styles.rightBlock}>
        <ThemeSwitch />
        <Notifications />
        <Profile />
      </div>
    </header>
  );
};

export default Header;
