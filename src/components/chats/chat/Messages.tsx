import React, { useEffect, useRef } from "react";
import defaultImg from "../../../assets/default.jpg";

import styles from "./Messages.module.css";

const Messages = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textMessage + " " + styles.other}>
        Some message text
      </div>
      <div className={styles.sentTime + " " + styles.your}>
        <span className={styles.time}>13:45</span>
      </div>
      <div className={styles.textMessage + " " + styles.your}>
        Your message text
      </div>
      <div className={styles.sentTime}>
        <img src={defaultImg} />
        John Paul
        <span className={styles.time}>14:05</span>
      </div>
      <div className={styles.textMessage + " " + styles.other}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
        ipsam deleniti est nihil error veniam ratione id et accusamus beatae
        aspernatur illum, culpa provident delectus odio quos ad consequuntur!
        Debitis ullam architecto iusto pariatur voluptatum, tempora praesentium.
        Excepturi ratione iure ad in explicabo quod, consectetur voluptas vero
        accusamus error!
      </div>
      <div className={styles.sentTime + " " + styles.your}>
        <span className={styles.time}>14:45</span>
      </div>
      <div className={styles.textMessage + " " + styles.your}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
        ipsam deleniti est nihil error veniam ratione id et accusamus beatae
        aspernatur illum, culpa provident delectus odio quos ad consequuntur!
        Debitis ullam architecto iusto pariatur voluptatum, tempora praesentium.
        Excepturi ratione iure ad in explicabo quod, consectetur voluptas vero
        accusamus error!
      </div>
      <div className={styles.sentTime + " " + styles.your}>
        <span className={styles.time}>14:55</span>
      </div>
      <div className={styles.textMessage + " " + styles.other}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
        ipsam deleniti est nihil error veniam ratione id et accusamus beatae
        aspernatur illum, culpa provident delectus odio quos ad consequuntur!
        Debitis ullam architecto iusto pariatur voluptatum, tempora praesentium.
        Excepturi ratione iure ad in explicabo quod, consectetur voluptas vero
        accusamus error!
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
