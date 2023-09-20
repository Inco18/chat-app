import Logo from "./Logo";

import styles from "./FormHeader.module.css";

const FormHeader = () => {
  return (
    <header className={styles.header}>
      <Logo />
    </header>
  );
};

export default FormHeader;
