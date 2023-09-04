import React, { useEffect, useState } from "react";

import { ReactComponent as Trash } from "../../../../assets/trash.svg";
import { ReactComponent as Check } from "../../../../assets/check.svg";
import AnimateHeight from "react-animate-height";

import styles from "./EventsList.module.css";
import OptionHeader from "./OptionHeader";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { db } from "../../../../services/firebase";
import { toast } from "react-toastify";

const eventDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const EventsList = () => {
  const [eventsVisible, setEventsVisible] = useState<boolean>(false);
  const [events, setEvents] = useState<
    { name: string; date: Date; id: string }[]
  >([]);
  const chatState = useAppSelector((state) => state.chat);
  const q = query(
    collection(db, "events", chatState.id, "events"),
    orderBy("date")
  );
  useEffect(() => {
    const unsub = onSnapshot(q, (querySnapshot) => {
      const newEvents: { name: string; date: Date; id: string }[] = [];
      querySnapshot.forEach((doc) => {
        newEvents.push({
          name: doc.data().name,
          date: doc.data().date.toDate(),
          id: doc.id,
        });
      });
      setEvents(newEvents);
    });

    return () => unsub();
  }, []);

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", chatState.id, "events", id));
    } catch (error: any) {
      toast.error("Could not delete event: " + error.message);
    }
  };

  return (
    <>
      <OptionHeader
        onClick={() => setEventsVisible((prev) => !prev)}
        title={"Events"}
        isOpen={eventsVisible}
      />
      <AnimateHeight duration={300} height={eventsVisible ? "auto" : 0}>
        <div className={styles.eventsContainer}>
          {events.length > 0 ? (
            events.map((event) => {
              return (
                <div className={styles.event} key={event.id}>
                  <div className={styles.eventActions}>
                    <Trash
                      className={styles.eventActionImg}
                      onClick={() => deleteEvent(event.id)}
                    />
                  </div>
                  <div className={styles.eventInfo}>
                    <p className={styles.eventTitle}>{event.name}</p>
                    <p className={styles.eventDate}>
                      {eventDateFormat.format(event.date)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.emptyMessage}>There are no events</p>
          )}
        </div>
      </AnimateHeight>
    </>
  );
};

export default EventsList;
