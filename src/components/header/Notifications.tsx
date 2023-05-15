import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as Bell } from "../../assets/bell.svg";
import defaultImg from "../../assets/default.png";
import useOutsideClick from "../../hooks/useOutsideClick";

import styles from "./Notifications.module.css";

const notificationsClassnames = {
  enter: styles.enter,
  enterActive: styles.enterActive,
  exit: styles.exit,
  exitActive: styles.exitActive,
};

const Notifications = () => {
  const [notificationsVisible, setNotificationsVisible] =
    useState<boolean>(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const bellContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick([notificationsRef, bellContainerRef], () =>
    setNotificationsVisible(false)
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.bellContainer}
        ref={bellContainerRef}
        onClick={() => setNotificationsVisible((prev) => !prev)}
      >
        <Bell className={styles.bell} />
        <div className={styles.dot} />
      </div>
      <CSSTransition
        in={notificationsVisible}
        timeout={300}
        classNames={notificationsClassnames}
        unmountOnExit
        nodeRef={notificationsRef}
      >
        <div className={styles.notifications} ref={notificationsRef}>
          <div className={styles.notificationsInner}>
            {/* <p className={styles.emptyText}>You don't have any notifications</p> */}

            <div className={styles.messageNotification}>
              <img src={defaultImg} />
              <div className={styles.notificationRightBlock}>
                <p className={styles.notificationText}>
                  <span className={styles.bold}>Adam Nowak</span> sent you a
                  message.
                </p>
                <p className={styles.notificationDate}>5 min ago</p>
              </div>
            </div>
            <div className={styles.messageNotification}>
              <img src={defaultImg} />
              <div className={styles.notificationRightBlock}>
                <p className={styles.notificationText}>
                  <span className={styles.bold}>Adam Nowak</span> sent you a
                  message.
                </p>
                <p className={styles.notificationDate}>5 min ago</p>
              </div>
            </div>
            <div className={styles.messageNotification}>
              <img src={defaultImg} />
              <div className={styles.notificationRightBlock}>
                <p className={styles.notificationText}>
                  <span className={styles.bold}>Adam Nowak</span> sent you a
                  message.
                </p>
                <p className={styles.notificationDate}>5 min ago</p>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Notifications;
