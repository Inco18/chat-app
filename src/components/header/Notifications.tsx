import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { ReactComponent as Bell } from "../../assets/bell.svg";
import { ReactComponent as Remove } from "../../assets/remove.svg";
import defaultImg from "../../assets/default.png";
import useOutsideClick from "../../hooks/useOutsideClick";
import { Timestamp, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useAppSelector } from "../../hooks/reduxHooks";

import styles from "./Notifications.module.css";
import { toast } from "react-toastify";

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

  const handleRemove = async (index: number) => {
    if (!auth.currentUser?.uid) return;
    const newNotifications = notifications.filter(
      (notification, i) => i !== index
    );
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        notifications: newNotifications,
      });
      setNotifications(newNotifications);
    } catch (error: any) {
      toast.error("Could not remove all notifications: " + error.message);
    }
  };

  const handleRemoveAll = async () => {
    if (!auth.currentUser?.uid) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        notifications: [],
      });
      setNotifications([]);
    } catch (error: any) {
      toast.error("Could not remove all notifications: " + error.message);
    }
  };

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
            {notifications.map((notification, i) => {
              return (
                <div className={styles.messageNotification} key={i}>
                  <img src={notification.imgUrl} />
                  <div className={styles.notificationRightBlock}>
                    <p className={styles.notificationText}>
                      {notification.text}
                    </p>
                    <p className={styles.notificationDate}>
                      {dateFormat.format(notification.timestamp.toDate())}
                    </p>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(i)}
                  >
                    <Remove />
                  </button>
                </div>
              );
            })}
          </div>
          {notifications.length > 0 && (
            <button
              title="Remove all notifications"
              className={styles.removeAllBtn}
              onClick={handleRemoveAll}
            >
              <Remove />
            </button>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

export default Notifications;
