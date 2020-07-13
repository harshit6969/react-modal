import React, { useEffect, createRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";

const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "area[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "button:not([disabled]):not([aria-hidden])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  '[tabindex]:not([tabindex^="-"])',
];

export default function Modal({ children, onModalClose, isOpen }) {
  const modalRef = createRef();

  useEffect(() => {
    function keyListener(e) {
      const listener = keyListenersMap.get(e.keyCode);
      return listener && listener(e);
    }

    document.addEventListener("keydown", keyListener);

    return () => document.removeEventListener("keydown", keyListener);
  });

  const handleTabKey = (e) => {
    if (isOpen) {
      // 1. Querying all the focusable nodes from the modal
      // 2. Filtering out the focusable nodes that are display:none
      const focusableNodes = Array(
        ...modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS) // 1
      ).filter((node) => node.offsetParent !== null); // 2

      if (!focusableNodes.length) {
        return;
      }

      const firstFocusableNode = focusableNodes[0];
      const lastFocusableNode = focusableNodes[focusableNodes.length - 1];

      if (!e.shiftKey && document.activeElement === lastFocusableNode) {
        firstFocusableNode.focus();
        e.preventDefault();
      }

      if (e.shiftKey && document.activeElement === firstFocusableNode) {
        lastFocusableNode.focus();
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
  } else {
    return null;
  }
}
