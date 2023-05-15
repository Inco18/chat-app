import React from "react";
import ReactModal from "react-modal";
import { ReactComponent as Plus } from "../../assets/plus.svg";

import styles from "./Modal.module.css";

const Modal = (props: {
  isOpen: boolean;
  closeFunction: () => void;
  title: String;
  children: React.ReactNode;
}) => {
  return (
    <ReactModal
      isOpen={props.isOpen}
      closeTimeoutMS={300}
      onRequestClose={() => props.closeFunction()}
      className={{
        base: styles.modal,
        afterOpen: styles.modalAfterOpen,
        beforeClose: styles.modalBeforeClose,
      }}
      overlayClassName={{
        base: styles.modalOverlay,
        afterOpen: styles.modalOverlayAfterOpen,
        beforeClose: styles.modalOverlayBeforeClose,
      }}
    >
      <Plus
        className={styles.closeImg}
        onClick={props.closeFunction}
        tabIndex={0}
      />
      <h3>{props.title}</h3>
      {props.children}
    </ReactModal>
  );
};

export default Modal;
