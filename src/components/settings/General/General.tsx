import styles from "./General.module.css";
import FirstName from "./FirstName";
import LastName from "./LastName";
import Email from "./Email";
import ProfileImg from "./ProfileImg";

const General = () => {
  return (
    <div className={styles.container}>
      <FirstName />
      <LastName />
      <Email />
      <ProfileImg />
    </div>
  );
};

export default General;
