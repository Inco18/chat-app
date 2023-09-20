import { ReactComponent as Arrow } from "../../../../assets/arrow.svg";

import styles from "./OptionHeader.module.css";

const OptionHeader = (props: {
  onClick: () => void;
  title: String;
  isOpen: boolean;
}) => {
  return (
    <p className={styles.optionsHeader} onClick={props.onClick}>
      {props.title}
      <Arrow
        className={styles.arrow}
        style={props.isOpen ? { transform: "rotate(-90deg)" } : {}}
      />
    </p>
  );
};

export default OptionHeader;
