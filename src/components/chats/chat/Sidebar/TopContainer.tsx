import React, { useState } from "react";
import defaultImg from "../../../../assets/default.png";
import { ReactComponent as Magnifier } from "../../../../assets/magnifier.svg";
import { ReactComponent as Plus } from "../../../../assets/plus.svg";
import { ReactComponent as Star } from "../../../../assets/star.svg";
import Modal from "../../../modals/Modal";
import AddEventModal from "../../../modals/AddEventModal";

import styles from "./TopContainer.module.css";

const TopContainer = (props: { toggleSearchInput: () => void }) => {
  const [addEventModalOpen, setAddEventModalOpen] = useState<boolean>(false);

  return (
    <div className={styles.topContainer}>
      <div className={styles.chatWithContainer}>
        <img src={defaultImg} />
        <p>John Paul</p>
      </div>
      <div className={styles.actionsContainer}>
        <div
          className={styles.actionContainer}
          onClick={props.toggleSearchInput}
        >
          <div className={styles.iconContainer}>
            <Magnifier />
          </div>
          <p>Search</p>
        </div>
        <div
          className={styles.actionContainer}
          onClick={() => setAddEventModalOpen((prev) => !prev)}
        >
          <div className={styles.iconContainer}>
            <Plus />
          </div>
          <p>Add new event</p>
        </div>
        <Modal
          isOpen={addEventModalOpen}
          closeFunction={() => setAddEventModalOpen((prev) => !prev)}
          title={"Add new event"}
        >
          <AddEventModal />
        </Modal>
        <div className={styles.actionContainer}>
          <div className={styles.iconContainer}>
            <Star />
          </div>
          <p>Add to favourites</p>
        </div>
      </div>
    </div>
  );
};

export default TopContainer;
