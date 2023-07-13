import React from "react";

import styles from "./FormMain.module.css";

const FormMain = (props: { children: React.ReactNode }) => {
  return <main className={styles.main}>{props.children}</main>;
};

export default FormMain;
