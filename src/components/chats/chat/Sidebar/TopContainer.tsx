import { useState } from "react";
import { ReactComponent as Plus } from "../../../../assets/plus.svg";
import { ReactComponent as Star } from "../../../../assets/star.svg";
import { ReactComponent as Unblock } from "../../../../assets/unblock.svg";
import { ReactComponent as Restore } from "../../../../assets/restore.svg";
import { ReactComponent as Trash } from "../../../../assets/trash.svg";
import Modal from "../../../modals/Modal";
import AddEventModal from "../../../modals/AddEventModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import {
  handleBlock,
  handleDelete,
  handleFavourite,
  handlePermDelete,
} from "../../../../redux/chatActions";
import { auth } from "../../../../services/firebase";

import styles from "./TopContainer.module.css";

const TopContainer = () => {
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
      chatState.blocked.length > 0
        ? navigate(`/chats/blocked/${chatState.id}`, { replace: true })
        : chatState.archived
        ? navigate(`/chats/archived/${chatState.id}`, { replace: true })
        : navigate(`/chats/all/${chatState.id}`, { replace: true });
      navigate(`/chats/all/${chatState.id}`, { replace: true });
    });
  };

  const onPermDelete = () => {
    dispatch(handlePermDelete({})).then(() => {
      navigate("/chats/all", { replace: true });
    });
  };

  const otherUser = chatState.users.filter(
    (user) => user.uid !== auth.currentUser?.uid
  );
  return (
    <div className={styles.topContainer}>
      <div className={styles.chatWithContainer}>
        <img
          src={
            chatState.title
              ? chatState.chatImgUrl
                ? chatState.chatImgUrl
                : "/defaultGroup.webp"
              : otherUser[0] && otherUser[0].avatarUrl
              ? otherUser[0].avatarUrl
              : otherUser[0] && otherUser[0].sex === "female"
              ? "/defaultFemale.webp"
              : "/defaultMale.webp"
          }
        />
        {chatState.title ? (
          <p>{chatState.title}</p>
        ) : (
          <p>
            {otherUser[0]
              ? `${otherUser[0].firstName} ${otherUser[0].lastName}`
              : "Unknown user"}
          </p>
        )}
      </div>
      <div className={styles.actionsContainer}>
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
                <AddEventModal closeFn={() => setAddEventModalOpen(false)} />
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
          </>
        )}
        {(pathname.includes("trash") || pathname.includes("archived")) && (
          <>
            <div className={styles.actionContainer}>
              <div className={styles.iconContainer} onClick={onPermDelete}>
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
