import React, { useEffect, useRef, useState } from "react";
import defaultImg from "../../../assets/default.jpg";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db, storage } from "../../../services/firebase";
import { receiveLastMsg } from "../../../redux/chatSlice";
import { loadMoreMsg } from "../../../redux/chatActions";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";

import styles from "./Messages.module.css";
import { ref } from "firebase/storage";

const Messages = () => {
  const chatState = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (chatState.messages.length < 6 && chatState.messages.length > 0)
      dispatch(loadMoreMsg({}));
    if (isScrolledToBottom) scrollToBottom();
  }, [chatState.messages]);

  const latestMsgQuery = query(
    collection(db, "messages", chatState.id, "messages"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  useEffect(() => {
    const unsub = onSnapshot(latestMsgQuery, (querySnapshot) => {
      const data = querySnapshot.docs[0].data();
      dispatch(
        receiveLastMsg({
          ...data,
          timestamp: data.timestamp.toDate().toString(),
        })
      );
    });

    return () => unsub();
  }, []);

  const func = async () => {
    console.log(123);
  };

  return (
    <div
      className={styles.container}
      id="scrollableDivChats"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      <InfiniteScroll
        inverse={true}
        dataLength={chatState.messages.length + 21}
        next={() => dispatch(loadMoreMsg({}))}
        hasMore={true}
        loader={<></>}
        scrollableTarget="scrollableDivChats"
        onScroll={(e: any) =>
          Math.floor(e.target.scrollTop) >= 0
            ? setIsScrolledToBottom(true)
            : setIsScrolledToBottom(false)
        }
      >
        {chatState.status === "loadingMessages" && (
          <div className={styles.spinner}>
            <SmallSpinner />
          </div>
        )}
        {chatState.messages.map((message) => {
          if (message.text) {
            return (
              <div
                key={message.timestamp.toString()}
                className={`${styles.textMessage} ${
                  message.sentBy === auth.currentUser?.uid
                    ? styles.your
                    : styles.other
                }`}
              >
                {message.text}
              </div>
            );
          } else if (message.filesUrls) {
            return message.filesUrls.map((fileUrl) => {
              const fileRef = ref(storage, fileUrl);
              console.log(fileRef);
              return (
                <div
                  key={message.timestamp.toString()}
                  className={`${styles.textMessage} ${
                    message.sentBy === auth.currentUser?.uid
                      ? styles.your
                      : styles.other
                  }`}
                >
                  Jakieś pliki czy coś
                </div>
              );
            });
          }
        })}
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
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.textMessage + " " + styles.other}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.textMessage + " " + styles.other}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.sentTime + " " + styles.your}>
          <span className={styles.time}>14:45</span>
        </div>
        <div className={styles.textMessage + " " + styles.your}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.sentTime + " " + styles.your}>
          <span className={styles.time}>14:55</span>
        </div>
        <div className={styles.textMessage + " " + styles.other}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
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
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.textMessage + " " + styles.other}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.textMessage + " " + styles.other}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.sentTime + " " + styles.your}>
          <span className={styles.time}>14:45</span>
        </div>
        <div className={styles.textMessage + " " + styles.your}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div className={styles.sentTime + " " + styles.your}>
          <span className={styles.time}>14:55</span>
        </div>
        <div className={styles.textMessage + " " + styles.other}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores modi
          ipsam deleniti est nihil error veniam ratione id et accusamus beatae
          aspernatur illum, culpa provident delectus odio quos ad consequuntur!
          Debitis ullam architecto iusto pariatur voluptatum, tempora
          praesentium. Excepturi ratione iure ad in explicabo quod, consectetur
          voluptas vero accusamus error!
        </div>
        <div ref={messagesEndRef} />
      </InfiniteScroll>
    </div>
  );
};

export default Messages;
