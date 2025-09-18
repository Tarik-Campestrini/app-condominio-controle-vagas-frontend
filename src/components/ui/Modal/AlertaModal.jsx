import React from "react";
import BaseModal from "./BaseModal";

const colorMap = {
  success: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
  danger: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100",
};

const AlertaModal = ({ isOpen, onClose, type = "info", message }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div
        className={`p-4 rounded-md text-center font-medium ${colorMap[type]}`}
      >
        {message}
      </div>
    </BaseModal>
  );
};

export default AlertaModal;
