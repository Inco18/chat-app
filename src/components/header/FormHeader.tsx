import React from "react";

import styles from "./FormHeader.module.css";
import Logo from "./Logo";

const FormHeader = () => {
  return (
    <header className={styles.header}>
      <Logo />
    </header>
  );
};

export default FormHeader;
