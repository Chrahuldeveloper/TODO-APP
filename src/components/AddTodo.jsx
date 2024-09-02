import { useState } from "react";

export default function AddTodo({ onAddTodo, onClose }) {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      content,
      description,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    onAddTodo(newTodo);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg w-[90%] md:w-[40%] h-[80vh]">
        <h2 className="text-lg font-semibold">Add New Todo</h2>
        <div className="mt-4">
          <label className="block">
            Task:
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="mt-4">
          <label className="block">
            Description:
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Add Todo
          </button>
        </div>
      </div>
    </div>
  );
}
