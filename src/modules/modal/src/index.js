import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./index.css";
import { useForkRef } from "../../common/useForkRef";
import { useRef } from "react";

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

const Modal = React.forwardRef((props, ref) => {
  if (props.isOpen) {
    return createPortal(
      <div className="modal-overlay">
        <ModalContent ref={ref} {...props} />
      </div>,
      document.body
    );
  } else {
    return null;
  }
});

const ModalContent = React.forwardRef(
  (
    {
      onClose,
      isOpen,
      initialFocusRef,
      closeTrigger = "",
      className = "",
      ...props
    },
    ref
  ) => {
    const modalRef = useRef(null);
    const forkedRef = useForkRef(ref, modalRef);

    const getFocusableNodes = useCallback(() => {
      if (modalRef.current) {
        return Array(
          ...modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS) // 1
        );
      }
      return [];
    }, [modalRef]);

    const setInitialFocus = () => {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
      }

      const focusableNodes = getFocusableNodes();

      if (!focusableNodes.length) {
        return;
      }

      const firstFocusableNode = focusableNodes.find(
        (node) => !node.hasAttribute(closeTrigger)
      );
      if (firstFocusableNode) {
        firstFocusableNode.focus();
      }
    };

    const handleTabKey = (e) => {
      if (isOpen) {
        // 1. Querying all the focusable nodes from the modal
        // 2. Filtering out the focusable nodes that are display:none
        const focusableNodes = getFocusableNodes().filter(
          (node) => node.offsetParent !== null
        ); // 2

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
      [27, onClose],
      [9, handleTabKey],
    ]);

    useEffect(
      () => {
        function keyListener(e) {
          const listener = keyListenersMap.get(e.keyCode);
          return listener && listener(e);
        }

        document.addEventListener("keydown", keyListener);

        setInitialFocus();

        return () => document.removeEventListener("keydown", keyListener);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <div
        {...props}
        ref={forkedRef}
        className={`modal-content ${className}`}
        role="dialog"
        aria-modal="true"
      />
    );
  }
);

export { Modal };
