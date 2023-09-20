import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimateHeight from "react-animate-height";
import { ReactComponent as Star } from "../../../../assets/star.svg";
import { ReactComponent as Bell } from "../../../../assets/bell.svg";
import { ReactComponent as Blocked } from "../../../../assets/blocked.svg";
import { ReactComponent as Trash } from "../../../../assets/trash.svg";
import { ReactComponent as Group } from "../../../../assets/group.svg";
import OptionHeader from "./OptionHeader";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import {
  handleBlock,
  handleDelete,
  handleFavourite,
  handleMute,
} from "../../../../redux/chatActions";
import { auth } from "../../../../services/firebase";
import Modal from "../../../modals/Modal";
import ParticipantsModal from "../../../modals/ParticipantsModal";

import styles from "./Other.module.css";

const Other = () => {
  const [otherVisible, setOtherVisible] = useState(false);
  const [participantsModalVisible, setParticipantsModalVisible] =
    useState(false);
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

  const onBlock = () => {
    dispatch(handleBlock({})).then(() => {
      navigate(`/chats/blocked/${chatState.id}`, { replace: true });
    });
  };

  const onDelete = () => {
    dispatch(handleDelete({})).then(() => {
      navigate(`/chats/trash/${chatState.id}`, { replace: true });
    });
  };

  return (
    <>
      <OptionHeader
        isOpen={otherVisible}
        title={"Other"}
        onClick={() => setOtherVisible((prev) => !prev)}
      />
      <AnimateHeight duration={300} height={otherVisible ? "auto" : 0}>
        <div className={styles.optionsInnerContainer}>
          {!pathname.includes("archived") && !pathname.includes("blocked") && (
            <>
              <div className={styles.option} onClick={onFavourite}>
                <Star
                  className={styles.optionImg}
                  style={{
                    fill:
                      auth.currentUser?.uid &&
                      chatState.favourite.includes(auth.currentUser.uid)
                        ? "white"
                        : "",
                  }}
                />
                <p className={styles.optionText}>
                  {auth.currentUser?.uid &&
                  chatState.favourite.includes(auth.currentUser.uid)
                    ? "Remove from favourites"
                    : "Add to favourites"}
                </p>
              </div>
              <div
                className={styles.option}
                onClick={() => dispatch(handleMute({}))}
              >
                <Bell
                  className={styles.optionImg}
                  style={{
                    fill:
                      auth.currentUser?.uid &&
                      chatState.muted.includes(auth.currentUser.uid)
                        ? "white"
                        : "",
                  }}
                />
                <p className={styles.optionText}>
                  {auth.currentUser?.uid &&
                  chatState.muted.includes(auth.currentUser.uid)
                    ? "Unmute"
                    : "Mute"}
                </p>
              </div>
              {chatState.title === "" && (
                <div className={styles.option} onClick={onBlock}>
                  <Blocked className={styles.optionImg} />
                  <p className={styles.optionText}>Block</p>
                </div>
              )}
              {chatState.title !== "" && (
                <div
                  className={styles.option}
                  onClick={() => {
                    setParticipantsModalVisible(true);
                  }}
                >
                  <Group className={styles.optionImg} />
                  <p className={styles.optionText}>Chat participants</p>
                </div>
              )}
            </>
          )}
          <div className={styles.option} onClick={onDelete}>
            <Trash className={styles.optionImg} />
            <p className={styles.optionText}>Delete</p>
          </div>
        </div>
        <Modal
          isOpen={participantsModalVisible}
          closeFunction={() => setParticipantsModalVisible(false)}
          title={"Chat participants"}
        >
          <ParticipantsModal
            closeFunction={() => setParticipantsModalVisible(false)}
          />
        </Modal>
      </AnimateHeight>
    </>
  );
};

export default Other;
