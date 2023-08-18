import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import defaultImg from "../../assets/default.png";
import useOutsideClick from "../../hooks/useOutsideClick";

import styles from "./Profile.module.css";
import { useAppSelector } from "../../hooks/reduxHooks";

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

  const { firstName, lastName } = useAppSelector((state) => state.user);

  useOutsideClick([optionsRef, nameImgRef], () => setOptionsVisible(false));

  return (
    <div className={styles.container}>
      <div
        className={styles.nameImg}
        ref={nameImgRef}
        onClick={() => setOptionsVisible((prev) => !prev)}
      >
        <p>{`${firstName} ${lastName}`}</p>
        <img src={defaultImg} className={styles.img} />
      </div>
      <CSSTransition
        in={optionsVisible}
        timeout={300}
        classNames={optionsClassnames}
        unmountOnExit
        nodeRef={optionsRef}
      >
        <div className={styles.options} ref={optionsRef}>
          <button>Logout</button>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Profile;
