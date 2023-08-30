import React, { useEffect, useState } from "react";

import styles from "./Customize.module.css";
import OptionHeader from "./OptionHeader";
import AnimateHeight from "react-animate-height";
import Modal from "../../../modals/Modal";
import ChangeThemeModal from "../../../modals/ChangeThemeModal";
import EditNicknamesModal from "../../../modals/EditNicknamesModal";
import { useAppSelector } from "../../../../hooks/reduxHooks";

const Customize = () => {
  const [customizeVisible, setCustomizeVisible] = useState<boolean>(false);
  const [changeThemeModalOpen, setChangeThemeModalOpen] =
    useState<boolean>(false);
  const [editNicknamesModalOpen, setEditNicknamesModalOpen] =
    useState<boolean>(false);
  const chatState = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (chatState.status === "idle") setChangeThemeModalOpen(false);
  }, [chatState.status]);

  return (
    <>
      <OptionHeader
        onClick={() => setCustomizeVisible((prev) => !prev)}
        isOpen={customizeVisible}
        title={"Customize this chat"}
      />
      <AnimateHeight duration={300} height={customizeVisible ? "auto" : 0}>
        <div className={styles.optionsInnerContainer}>
          <div
            className={styles.option}
            onClick={() => setChangeThemeModalOpen((prev) => !prev)}
          >
            <div className={styles.themeColor}></div>
            <p className={styles.optionText}>Change theme</p>
          </div>
          <Modal
            isOpen={changeThemeModalOpen}
            closeFunction={() => setChangeThemeModalOpen((prev) => !prev)}
            title={"Change chat theme"}
          >
            <ChangeThemeModal />
          </Modal>
          <div
            className={styles.option}
            onClick={() => setEditNicknamesModalOpen((prev) => !prev)}
          >
            <p className={styles.nicknameLetters}>Aa</p>
            <p className={styles.optionText}>Edit nicknames</p>
          </div>
        </div>
        <Modal
          isOpen={editNicknamesModalOpen}
          closeFunction={() => setEditNicknamesModalOpen((prev) => !prev)}
          title={"Edit nicknames"}
        >
          <EditNicknamesModal />
        </Modal>
      </AnimateHeight>
    </>
  );
};

export default Customize;
