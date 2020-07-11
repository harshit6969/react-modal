import React, { useEffect, createRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";

export default function Modal({ children, onModalClose, isOpen }) {
  useEffect(() => {
    function keyListener(e) {
      const listener = keyListenersMap.get(e.keyCode);
      return listener && listener(e);
    }
    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  });

  const modalRef = createRef();
  const handleTabKey = (e) => {
    if (isOpen) {
      const focusableModalElements = modalRef.current.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
      );
      const firstElement = focusableModalElements[0];
      const lastElement =
        focusableModalElements[focusableModalElements.length - 1];

      if (!e.shiftKey && document.activeElement !== firstElement) {
        firstElement.focus();
        return e.preventDefault();
      }

      if (e.shiftKey && document.activeElement !== lastElement) {
        lastElement.focus();
        e.preventDefault();
      }
    }
  };

  const keyListenersMap = new Map([
    [27, onModalClose],
    [9, handleTabKey],
  ]);
  if (isOpen) {
    return createPortal(
      <div className="modal-container" role="dialog" aria-modal="true">
        <div className="modal-content" ref={modalRef}>
          {children}
        </div>
      </div>,
      document.body
    );
  }
  return null;
}
