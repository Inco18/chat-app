import React from "react";

import styles from "./BlocksList.module.css";
import SettingsBlock from "./SettingsBlock";
import General from "./General";

const BlocksList = () => {
  return (
    <main className={styles.container}>
      <SettingsBlock title="General account settings">
        <General />
      </SettingsBlock>
    </main>
  );
};

export default BlocksList;
