import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./index.css";
import { useForkRef } from "../../common/useForkRef";
import { useRef } from "react";
import PropTypes from "prop-types";

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

const Modal = React.forwardRef(({ clickOutsideToClose, ...props }, ref) => {
  const overlayRef = useRef(null);
  if (props.isOpen) {
    return createPortal(
      <div
        ref={overlayRef}
        className="modal-overlay"
        onClick={(e) => {
          if (e.target === overlayRef.current && clickOutsideToClose) {
            e.stopPropagation();
            props.onClose();
          }
        }}
      >
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
    { onClose, isOpen, initialFocusRef, closeTrigger, className, ...props },
    ref
  ) => {
    const modalRef = useRef(null);
    const forkedRef = useForkRef(ref, modalRef);

    const getFocusableNodes = useCallback(() => {
      return modalRef.current
        ? Array(...modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS))
        : [];
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
        const focusableNodes = getFocusableNodes().filter(
          (node) => node.offsetParent !== null
        );

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

    useEffect(
      () => {
        const keyListenersMap = new Map([
          [27, onClose],
          [9, handleTabKey],
        ]);

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

Modal.propTypes = {
  // To govern, if the modal should close when overlay is clicked
  clickOutsideToClose: PropTypes.bool,

  // To close the modal, since its being controlled from outside
  onClose: PropTypes.func.isRequired,

  // To govern the open/close state of the modal
  isOpen: PropTypes.bool,

  // Ref of the element that should be autofocus when the modal opens
  // If nothing is provided, first tab-able element will be focused
  initialFocusRef: PropTypes.object,

  // data attr of close button/icon to avoid it being the first focusable element
  closeTrigger: PropTypes.string,

  // Custom className for the modal container
  className: PropTypes.string,
};

Modal.defaultProps = {
  clickOutsideToClose: false,
  isOpen: false,
  closeTrigger: "",
  className: "",
};
