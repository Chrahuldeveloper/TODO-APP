import React, { useState, useEffect } from "react";

export default function EditModel({ todo, onSave, onClose }) {
  const [content, setContent] = useState(todo.content || "");
  const [description, setDescription] = useState(todo.description || "");

  useEffect(() => {
    setContent(todo.content || "");
    setDescription(todo.description || "");
  }, [todo]);

  const handleSave = () => {
    if (content.trim() && description.trim()) {
      onSave({ ...todo, content, description });
      onClose(); // Close modal after saving
    } else {
      alert("Please fill in both the title and description.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-60 backdrop-blur-md"
      role="dialog"
      aria-labelledby="editTaskTitle"
      aria-describedby="editTaskDescription"
    >
      <div className="bg-white p-6 rounded-md shadow-md w-[90%] md:w-[40%] h-[80vh] overflow-y-auto">
        <h2 id="editTaskTitle" className="mb-4 text-xl font-semibold">
          Edit Task
        </h2>
        <label htmlFor="taskTitle" className="block mb-2 font-semibold">
          Title
        </label>
        <input
          id="taskTitle"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-b-[1px] border-gray-300 p-2 w-full mb-4 outline-none"
        />
        <label
          htmlFor="taskDescription"
          className="block mb-2 font-semibold"
        >
          Description
        </label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-b-[1px] border-gray-300 p-2 w-full mb-4 outline-none"
          rows="6"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose} // Attach onClose to the Cancel button
            className="px-3 py-2 text-white bg-red-500 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 text-white bg-blue-500 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
