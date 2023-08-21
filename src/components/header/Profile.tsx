import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import defaultImg from "../../assets/default.png";
import useOutsideClick from "../../hooks/useOutsideClick";

import styles from "./Profile.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logout } from "../../redux/userActions";

const optionsClassnames = {
  enter: styles.enter,
  enterActive: styles.enterActive,
  exit: styles.exit,
  exitActive: styles.exitActive,
};

const Profile = () => {
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const nameImgRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { firstName, lastName, sex, avatarUrl, status } = useAppSelector(
    (state) => state.user
  );
  const isLoggingOut = status === "loggingOut";

  useOutsideClick([optionsRef, nameImgRef], () => setOptionsVisible(false));

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.nameImg}
        ref={nameImgRef}
        onClick={() => setOptionsVisible((prev) => !prev)}
      >
        <p>{`${firstName} ${lastName}`}</p>
        <img
          src={
            avatarUrl
              ? avatarUrl
              : sex === "female"
              ? "/defaultFemale.webp"
              : "/defaultMale.webp"
          }
          className={styles.img}
        />
      </div>
      <CSSTransition
        in={optionsVisible}
        timeout={300}
        classNames={optionsClassnames}
        unmountOnExit
        nodeRef={optionsRef}
      >
        <div className={styles.options} ref={optionsRef}>
          <button onClick={onLogout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <span className={styles.loadingButtonText}>Logging out</span>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Profile;
