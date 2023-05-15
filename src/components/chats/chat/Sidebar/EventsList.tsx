import React, { useState } from "react";

import { ReactComponent as Trash } from "../../../../assets/trash.svg";
import { ReactComponent as Check } from "../../../../assets/check.svg";
import AnimateHeight from "react-animate-height";

import styles from "./EventsList.module.css";
import OptionHeader from "./OptionHeader";

const eventDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const EventsList = () => {
  const [eventsVisible, setEventsVisible] = useState<boolean>(false);

  return (
    <>
      <OptionHeader
        onClick={() => setEventsVisible((prev) => !prev)}
        title={"Events"}
        isOpen={eventsVisible}
      />
      <AnimateHeight duration={300} height={eventsVisible ? "auto" : 0}>
        <div className={styles.eventsContainer}>
          <div className={styles.event}>
            <div className={styles.eventActions}>
              <Check className={styles.eventActionImg} />
              <Trash className={styles.eventActionImg} />
            </div>
            <div className={styles.eventInfo}>
              <p className={styles.eventTitle}>
                Meeting in the shopping centre
              </p>
              <p className={styles.eventDate}>
                {eventDateFormat.format(new Date())}
              </p>
            </div>
          </div>
          <div className={styles.event}>
            <div className={styles.eventActions}>
              <Check className={styles.eventActionImg} />
              <Trash className={styles.eventActionImg} />
            </div>
            <div className={styles.eventInfo}>
              <p className={styles.eventTitle}>
                Meeting in the shopping centre
              </p>
              <p className={styles.eventDate}>
                {eventDateFormat.format(new Date())}
              </p>
            </div>
          </div>
          <div className={styles.event}>
            <div className={styles.eventActions}>
              <Check className={styles.eventActionImg} />
              <Trash className={styles.eventActionImg} />
            </div>
            <div className={styles.eventInfo}>
              <p className={styles.eventTitle}>
                Meeting in the shopping centre
              </p>
              <p className={styles.eventDate}>
                {eventDateFormat.format(new Date())}
              </p>
            </div>
          </div>
          <div className={styles.event}>
            <div className={styles.eventActions}>
              <Check className={styles.eventActionImg} />
              <Trash className={styles.eventActionImg} />
            </div>
            <div className={styles.eventInfo}>
              <p className={styles.eventTitle}>
                Meeting in the shopping centre
              </p>
              <p className={styles.eventDate}>
                {eventDateFormat.format(new Date())}
              </p>
            </div>
          </div>
          <div className={styles.event}>
            <div className={styles.eventActions}>
              <Check className={styles.eventActionImg} />
              <Trash className={styles.eventActionImg} />
            </div>
            <div className={styles.eventInfo}>
              <p className={styles.eventTitle}>
                Meeting in the shopping centre
              </p>
              <p className={styles.eventDate}>
                {eventDateFormat.format(new Date())}
              </p>
            </div>
          </div>
        </div>
      </AnimateHeight>
    </>
  );
};

export default EventsList;
