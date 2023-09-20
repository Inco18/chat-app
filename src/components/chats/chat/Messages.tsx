import { useEffect, useRef, useState } from "react";
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
import { loadMoreMsg, markLastMsgAsRead } from "../../../redux/chatActions";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactComponent as FileImg } from "../../../assets/file.svg";
import { ReactComponent as SmallSpinner } from "../../../assets/spinner.svg";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ref } from "firebase/storage";
import fileDownload from "js-file-download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import styles from "./Messages.module.css";

const msgDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const Messages = () => {
  const chatState = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [lightboxImg, setLightboxImg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesLengthRef = useRef(chatState.messages.length);

  useEffect(() => {
    messagesLengthRef.current = chatState.messages.length;
  }, [chatState.messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (isScrolledToBottom) scrollToBottom();
  }, [chatState.messages]);

  const latestMsgQuery = query(
    collection(db, "messages", chatState.id, "messages"),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  useEffect(() => {
    const unsub = onSnapshot(latestMsgQuery, (querySnapshot) => {
      if (
        !querySnapshot.metadata.hasPendingWrites &&
        querySnapshot.docChanges()[0].type !== "modified"
      ) {
        const data = querySnapshot.docs[0].data();
        dispatch(
          receiveLastMsg({
            ...data,
            timestamp: data.timestamp.toDate().toString(),
          })
        );
        console.log(messagesLengthRef.current);
        if (messagesLengthRef.current === 0 && querySnapshot.docs.length === 1)
          dispatch(loadMoreMsg(10));
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (
      chatState.messages.length > 0 &&
      chatState.messages[chatState.messages.length - 1].sentBy !==
        auth.currentUser?.uid &&
      isScrolledToBottom
    ) {
      dispatch(markLastMsgAsRead({}));
    }
  }, [chatState.messages, isScrolledToBottom]);

  return (
    <div
      className={styles.container}
      id="scrollableDivChats"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      <InfiniteScroll
        inverse={true}
        dataLength={chatState.messages.length}
        next={() => {
          chatState.messages.length > 0 && dispatch(loadMoreMsg(5));
        }}
        hasMore={true}
        loader={<></>}
        scrollableTarget="scrollableDivChats"
        onScroll={(e: any) =>
          Math.floor(e.target.scrollTop) >= 0
            ? setIsScrolledToBottom(true)
            : setIsScrolledToBottom(false)
        }
        style={{ overflowAnchor: "none" }}
      >
        {chatState.status === "loadingMessages" && (
          <div className={styles.spinner}>
            <SmallSpinner />
          </div>
        )}
        {chatState.messages.map((message, i) => {
          let timeSent;
          if (
            (i > 0 &&
              message.sentBy !== auth.currentUser?.uid &&
              message.sentBy !== chatState.messages[i - 1].sentBy) ||
            (i == 0 && message.sentBy !== auth.currentUser?.uid) ||
            (i > 0 &&
              message.sentBy !== auth.currentUser?.uid &&
              parseInt(
                (new Date(message.timestamp).getTime() / 1000).toFixed(0)
              ) -
                parseInt(
                  (
                    new Date(chatState.messages[i - 1].timestamp).getTime() /
                    1000
                  ).toFixed(0)
                ) >
                600)
          ) {
            const sentByUser = chatState.users.filter(
              (user) => user.uid === message.sentBy
            );
            timeSent = (
              <div className={styles.sentTime} key={`time${message.timestamp}`}>
                <img
                  src={
                    !sentByUser[0]
                      ? "/defaultMale.webp"
                      : sentByUser[0] && sentByUser[0].avatarUrl
                      ? sentByUser[0].avatarUrl
                      : sentByUser[0] && sentByUser[0].sex === "female"
                      ? "/defaultFemale.webp"
                      : "/defaultMale.webp"
                  }
                />
                {!sentByUser[0]
                  ? "Unknown user"
                  : chatState.settings.nicknames[message.sentBy]
                  ? chatState.settings.nicknames[message.sentBy]
                  : `${sentByUser[0].firstName} ${sentByUser[0].lastName}`}
                <span className={styles.time}>
                  {msgDateFormat.format(new Date(message.timestamp))}
                </span>
              </div>
            );
          } else if (
            (i > 0 &&
              message.sentBy === auth.currentUser?.uid &&
              parseInt(
                (new Date(message.timestamp).getTime() / 1000).toFixed(0)
              ) -
                parseInt(
                  (
                    new Date(chatState.messages[i - 1].timestamp).getTime() /
                    1000
                  ).toFixed(0)
                ) >
                600) ||
            (i === 0 && message.sentBy === auth.currentUser?.uid) ||
            (i > 0 &&
              message.sentBy === auth.currentUser?.uid &&
              chatState.messages[i - 1].sentBy !== auth.currentUser?.uid)
          ) {
            timeSent = (
              <div
                className={styles.sentTime + " " + styles.your}
                key={`time${message.timestamp}`}
              >
                <span className={styles.time}>
                  {msgDateFormat.format(new Date(message.timestamp))}
                </span>
              </div>
            );
          }

          if (message.text && message.filesUrls.length < 1) {
            return (
              <>
                {timeSent && timeSent}
                <div
                  key={message.timestamp.toString()}
                  title={msgDateFormat.format(new Date(message.timestamp))}
                  className={`${styles.textMessage} ${
                    message.sentBy === auth.currentUser?.uid
                      ? styles.your
                      : styles.other
                  }`}
                >
                  {message.text}
                </div>
              </>
            );
          }
          if (message.filesUrls.length > 0) {
            return (
              <>
                {timeSent && timeSent}
                <div
                  title={msgDateFormat.format(new Date(message.timestamp))}
                  key={message.timestamp.toString()}
                  className={`${styles.filesMessage} ${
                    message.sentBy === auth.currentUser?.uid
                      ? styles.your
                      : styles.other
                  }`}
                >
                  {message.text && <p>{message.text}</p>}
                  <div
                    className={
                      message.filesUrls.some((fileUrl) => {
                        const fileRef = ref(storage, fileUrl);
                        return (
                          fileRef.name.includes(".jpg") ||
                          fileRef.name.includes(".jpeg") ||
                          fileRef.name.includes(".png") ||
                          fileRef.name.includes(".webp")
                        );
                      })
                        ? styles.imagesContainer
                        : styles.filesContainer
                    }
                  >
                    {message.filesUrls.map((fileUrl) => {
                      const fileRef = ref(storage, fileUrl);
                      if (
                        fileRef.name.includes(".jpg") ||
                        fileRef.name.includes(".jpeg") ||
                        fileRef.name.includes(".png") ||
                        fileRef.name.includes(".webp") ||
                        fileRef.name.includes(".svg")
                      ) {
                        return (
                          <button
                            key={fileUrl}
                            className={styles.imgBtn}
                            onClick={() => {
                              setLightboxImg(fileUrl);
                            }}
                          >
                            <img src={fileUrl} alt={fileRef.name} />
                          </button>
                        );
                      } else {
                        return (
                          <button
                            key={fileUrl}
                            className={styles.fileBtn}
                            onClick={() => {
                              const xhr = new XMLHttpRequest();
                              xhr.responseType = "blob";
                              xhr.onload = (event) => {
                                const blob = xhr.response;
                                fileDownload(blob, fileRef.name);
                              };
                              xhr.open("GET", fileUrl);
                              xhr.send();
                            }}
                          >
                            <FileImg className={styles.fileImg} />
                            <div className={styles.fileBtnText}>
                              {fileRef.name}
                            </div>
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              </>
            );
          }

          if (message.gifUrl) {
            return (
              <>
                {timeSent && timeSent}
                <div
                  title={msgDateFormat.format(new Date(message.timestamp))}
                  key={message.timestamp}
                  className={`${styles.gifMessage} ${
                    message.sentBy === auth.currentUser?.uid
                      ? styles.your
                      : styles.other
                  }`}
                >
                  <img src={message.gifUrl} />
                </div>
              </>
            );
          }
        })}
        <Lightbox
          open={Boolean(lightboxImg)}
          close={() => setLightboxImg("")}
          slides={[{ src: lightboxImg }]}
          plugins={[Fullscreen, Download, Zoom]}
          carousel={{ finite: true }}
          controller={{ closeOnBackdropClick: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
        />
        <div ref={messagesEndRef} />
      </InfiniteScroll>
    </div>
  );
};

export default Messages;
