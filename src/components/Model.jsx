import React from "react";

export default function Model({ todo, closeModel }) {
  if (!todo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-60 backdrop-blur-md">
      <div className="bg-white rounded-lg p-5 w-[90%] md:w-[40%] h-[80vh] overflow-y-auto">
        <h1 className="mb-4 text-xl font-bold">Task Details</h1>
        <h2 className="mb-2 text-lg font-bold">{todo.content}</h2>
        <p className="mb-4 text-slate-700">{todo.description}</p>
        <p className="text-sm text-gray-600">Created At: {todo.createdAt}</p>
        <div className="flex justify-end">
          <button
            onClick={closeModel}
            className="px-4 py-2 mt-5 text-white bg-blue-600 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
