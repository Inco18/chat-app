import React, { useEffect, useState } from "react";
import defaultImg from "../../../../assets/default.png";
import { ReactComponent as Magnifier } from "../../../../assets/magnifier.svg";
import { ReactComponent as Plus } from "../../../../assets/plus.svg";
import { ReactComponent as Star } from "../../../../assets/star.svg";
import { ReactComponent as Unblock } from "../../../../assets/unblock.svg";
import { ReactComponent as Restore } from "../../../../assets/restore.svg";
import { ReactComponent as Trash } from "../../../../assets/trash.svg";

import Modal from "../../../modals/Modal";
import AddEventModal from "../../../modals/AddEventModal";

import styles from "./TopContainer.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import {
  handleBlock,
  handleDelete,
  handleFavourite,
} from "../../../../redux/chatActions";
import { auth } from "../../../../services/firebase";

const TopContainer = (props: { toggleSearchInput: () => void }) => {
  const [addEventModalOpen, setAddEventModalOpen] = useState<boolean>(false);
  const chatState = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onFavourite = () => {
    dispatch(handleFavourite({})).then((action) => {
      if (auth.currentUser && !action.payload.includes[auth.currentUser.uid]) {
        navigate(`/chats/all/${chatState.id}`, { replace: true });
      }
    });
  };

  const onRestore = () => {
    dispatch(handleDelete({})).then(() => {
      navigate(`/chats/all/${chatState.id}`, { replace: true });
    });
  };

  return (
    <div className={styles.topContainer}>
      <div className={styles.chatWithContainer}>
        <img
          src={
            chatState.title
              ? chatState.chatImgUrl
                ? chatState.chatImgUrl
                : "/defaultGroup.webp"
              : chatState.users[1].avatarUrl
              ? chatState.users[1].avatarUrl
              : chatState.users[1].sex === "female"
              ? "/defaultFemale.webp"
              : "/defaultMale.webp"
          }
        />
        {chatState.title ? (
          <p>{chatState.title}</p>
        ) : (
          <p>
            {chatState.users[1].firstName} {chatState.users[1].lastName}
          </p>
        )}
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
        {!pathname.includes("archived") &&
          !pathname.includes("blocked") &&
          !pathname.includes("trash") && (
            <>
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
                <div className={styles.iconContainer} onClick={onFavourite}>
                  <Star
                    style={{
                      fill:
                        auth.currentUser?.uid &&
                        chatState.favourite.includes(auth.currentUser.uid)
                          ? "white"
                          : "",
                    }}
                  />
                </div>
                <p>
                  {auth.currentUser?.uid &&
                  chatState.favourite.includes(auth.currentUser.uid)
                    ? "Remove from fav."
                    : "Add to favourites"}
                </p>
              </div>
            </>
          )}
        {pathname.includes("blocked") &&
          auth.currentUser &&
          chatState.blocked.includes(auth.currentUser.uid) && (
            <div className={styles.actionContainer}>
              <div
                className={styles.iconContainer}
                onClick={() => {
                  dispatch(handleBlock({})).then(() => {
                    navigate(`/chats/all/${chatState.id}`, { replace: true });
                  });
                }}
              >
                <Unblock />
              </div>
              <p>Unblock</p>
            </div>
          )}
        {pathname.includes("trash") && (
          <>
            <div className={styles.actionContainer}>
              <div className={styles.iconContainer} onClick={onRestore}>
                <Restore />
              </div>
              <p>Restore</p>
            </div>
            <div className={styles.actionContainer}>
              <div className={styles.iconContainer} onClick={onRestore}>
                <Trash />
              </div>
              <p>Delete permanently</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopContainer;
