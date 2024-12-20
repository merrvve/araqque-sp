"use client";

import React, { FC } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> & {
  Header: FC<{ children: React.ReactNode }>;
  Body: FC<{ children: React.ReactNode }>;
  Footer: FC<{ children: React.ReactNode }>;
} = ({ show, onClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-lg">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

Modal.Header = ({ children }) => (
  <div className="px-4 py-3 border-b border-gray-200">
    <h2 className="text-lg font-medium text-gray-800">{children}</h2>
  </div>
);

Modal.Body = ({ children }) => (
  <div className="p-4 text-gray-700">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
    {children}
  </div>
);

export default Modal;
