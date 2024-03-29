import { ReactComponent as LogoImg } from "../../assets/logo.svg";

import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <div className={styles.container}>
      <LogoImg className={styles.logoIcon} />
      <p className={styles.name}>
        Chat<span className={styles.span}>App</span>
      </p>
    </div>
  );
};

export default Logo;
