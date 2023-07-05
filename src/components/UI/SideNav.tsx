import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";

import styles from "./SideNav.module.css";

const SideNav = (props: { children?: React.ReactNode }) => {
  const [thinNav, setThinNav] = useState<boolean>(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize?.width > 1400) setThinNav(false);
      else setThinNav(true);
    }
  }, [windowSize]);
  return (
    <nav className={`${styles.sideNav} ${thinNav ? styles.thin : ""}`}>
      <Arrow
        className={styles.arrowIcon}
        onClick={() => setThinNav((prev) => !prev)}
      />
      {props.children}
    </nav>
  );
};

export default SideNav;
