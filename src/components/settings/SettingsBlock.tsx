import React from "react";

import styles from "./SettingsBlock.module.css";

const SettingsBlock = React.forwardRef(
  (
    props: { title: string; children?: React.ReactNode },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div className={styles.container} ref={ref}>
        <h3>{props.title}</h3>
        <div className={styles.settingsContainer}>{props.children}</div>
      </div>
    );
  }
);

export default SettingsBlock;
