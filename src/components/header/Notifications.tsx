import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as Bell } from "../../assets/bell.svg";
import defaultImg from "../../assets/default.png";
import useOutsideClick from "../../hooks/useOutsideClick";

import styles from "./Notifications.module.css";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useAppSelector } from "../../hooks/reduxHooks";

const notificationsClassnames = {
  enter: styles.enter,
  enterActive: styles.enterActive,
  exit: styles.exit,
  exitActive: styles.exitActive,
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const Notifications = () => {
  const [notificationsVisible, setNotificationsVisible] =
    useState<boolean>(false);
  const [notifications, setNotifications] = useState<
    { text: string; timestamp: Timestamp; imgUrl: string }[]
  >([]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const bellContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick([notificationsRef, bellContainerRef], () =>
    setNotificationsVisible(false)
  );

  useEffect(() => {
    let unsub: () => void;
    if (auth.currentUser?.uid) {
      unsub = onSnapshot(doc(db, "users", auth.currentUser?.uid), (doc) => {
        if (doc.metadata.hasPendingWrites) return;
        setNotifications(doc.data()?.notifications || []);
      });
    }

    return () => unsub();
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={styles.bellContainer}
        ref={bellContainerRef}
        onClick={() => setNotificationsVisible((prev) => !prev)}
      >
        <Bell className={styles.bell} />
        {notifications.length > 0 && <div className={styles.dot} />}
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
            {notifications.length < 1 && (
              <p className={styles.emptyText}>
                You don't have any notifications
              </p>
            )}
            {notifications.map((notification) => {
              return (
                <div className={styles.messageNotification}>
                  <img src={notification.imgUrl} />
                  <div className={styles.notificationRightBlock}>
                    <p className={styles.notificationText}>
                      {notification.text}
                    </p>
                    <p className={styles.notificationDate}>
                      {dateFormat.format(notification.timestamp.toDate())}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Notifications;
