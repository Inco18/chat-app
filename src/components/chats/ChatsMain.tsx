import React from "react";

import styles from "./ChatsMain.module.css";

const ChatsMain = (props: { children?: React.ReactNode }) => {
  return <main className={styles.mainContainer}>{props.children}</main>;
};

export default ChatsMain;
