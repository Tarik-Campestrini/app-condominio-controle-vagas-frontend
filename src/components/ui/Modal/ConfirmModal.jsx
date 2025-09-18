import React from "react";
import BaseModal from "./BaseModal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Tem certeza?",
  description = "Essa ação não poderá ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}) => {
  const colorMap = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
          onClick={onClose}
        >
          {cancelText}
        </button>
        <button
          className={`px-4 py-2 rounded ${colorMap[type]}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
