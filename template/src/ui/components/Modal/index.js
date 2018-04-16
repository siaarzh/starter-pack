import React from 'react';
import ReactDOM from 'react-dom';

export function ModalPortal({ children }) {
  return ReactDOM.createPortal(children, global.document.getElementById('modal-mount-point'));
}

export default function Modal({ children }) {
  return (
    <ModalPortal>
      <div className="z999 relative">{children}</div>
    </ModalPortal>
  );
}
