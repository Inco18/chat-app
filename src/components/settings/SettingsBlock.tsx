import React from "react";

import styles from "./SettingsBlock.module.css";

const SettingsBlock = (props: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={styles.container}>
      <h3>{props.title}</h3>
      <div className={styles.settingsContainer}>{props.children}</div>
    </div>
  );
};

export default SettingsBlock;
