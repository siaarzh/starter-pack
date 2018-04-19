import React from 'react';
import ReactDOM from 'react-dom';

export function ModalPortal({ children }) {
  if (process.env.TARGET !== 'node') {
    return ReactDOM.createPortal(children, global.document.getElementById('modal-mount-point'));
  } else {
    return null;
  }
}

export default function Modal({ children }) {
  return (
    <ModalPortal>
      <div className="z999 relative">{children}</div>
    </ModalPortal>
  );
}
