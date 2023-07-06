import React from "react";

import styles from "./BlocksList.module.css";
import SettingsBlock from "./SettingsBlock";
import General from "./General";
import Privacy from "./Privacy";

const BlocksList = () => {
  return (
    <main className={styles.container}>
      <SettingsBlock title="General account settings">
        <General />
      </SettingsBlock>
      <SettingsBlock title="Privacy settings">
        <Privacy />
      </SettingsBlock>
    </main>
  );
};

export default BlocksList;
