import React from "react";

interface EditButtonsProps {
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void; 
  editLabel?: string;    
  saveLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;
}

export const EditButtons: React.FC<EditButtonsProps> = ({
  editMode,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  editLabel = "Edit",
  saveLabel = "Save",
  cancelLabel = "Cancel",
  deleteLabel = "Delete",
}) => {
  return (
    <div className="flex gap-2 mt-4">
      {!editMode ? (
        <>
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editLabel}
        </button>
        {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {deleteLabel}
            </button>
          )}
          </>
      ) : (
        <>
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {saveLabel}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            {cancelLabel}
          </button>
        </>
      )}
    </div>
  );
};

export default EditButtons;
