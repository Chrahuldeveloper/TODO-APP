import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Navbar from "../components/Navbar";
import Model from "../components/Model";
import EditModel from "../components/EditModel";
import AddTodo from "../components/AddTodo";
import axios from "axios";
import Loader from "../components/Loader";

const API_URL = "http://localhost:9000";

export default function Home() {
  const [todos, setTodos] = useState({ todo: [], inProgress: [], done: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Recent");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const jwt = localStorage.getItem("jwt");

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/${jwt}/todos`);
      const fetchedTodos = response.data;
      if (
        fetchedTodos.todo instanceof Array &&
        fetchedTodos.inProgress instanceof Array &&
        fetchedTodos.done instanceof Array
      ) {
        setTodos(fetchedTodos);
      } else {
        console.error("Fetched data has an incorrect structure:", fetchedTodos);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setIsLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleDelete = async (id, status) => {
    try {
      await axios.delete(`${API_URL}/${jwt}/todos/${id}`);
      setTodos((prevTodos) => ({
        ...prevTodos,
        [status]: prevTodos[status].filter((todo) => todo._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (id, status) => {
    const todo = todos[status].find((todo) => todo._id === id);
    setEditingTodo({ ...todo, status });
  };

  const handleViewDetails = (id, status) => {
    const todo = todos[status].find((todo) => todo._id === id);
    setSelectedTodo(todo);
  };

  const closeModel = () => {
    setSelectedTodo(null);
  };

  const closeEditModel = () => {
    setEditingTodo(null);
  };

  const closeAddTodoModel = () => {
    setShowAddTodo(false);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceList = [...todos[source.droppableId]];
    const destList = [...todos[destination.droppableId]];

    const [movedTodo] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedTodo);

    const newTodos = {
      ...todos,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    };
    setTodos(newTodos);

    const updatedTodo = {
      ...movedTodo,
      status: destination.droppableId,
    };

    try {
      await axios.put(`${API_URL}/${jwt}/todos/${movedTodo._id}`, updatedTodo);
    } catch (error) {
      console.error("Error updating todo status:", error);
      setTodos(todos);
    }
  };

  const handleSaveEdit = async (updatedTodo) => {
    try {
      await axios.put(
        `${API_URL}/${jwt}/todos/${updatedTodo._id}`,
        updatedTodo
      );
      setTodos((prevTodos) => {
        const updatedTodos = { ...prevTodos };
        updatedTodos[editingTodo.status] = updatedTodos[
          editingTodo.status
        ].filter((todo) => todo._id !== updatedTodo._id);
        updatedTodos[updatedTodo.status].push(updatedTodo);
        return updatedTodos;
      });
      closeEditModel();
    } catch (error) {
      console.error("Error saving edited todo:", error);
    }
  };

  const handleAddTodo = async (newTodo) => {
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/${jwt}/todos`, newTodo);
      await fetchTodos();
      setIsLoading(false);
      closeAddTodoModel();
    } catch (error) {
      console.error("Error adding todo:", error);
      setIsLoading(false);
    }
  };

  const filteredTodos = {};
  Object.keys(todos).forEach((status) => {
    filteredTodos[status] = (todos[status] || []).filter(
      (todo) =>
        todo.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  if (sortOption === "Recent") {
    Object.keys(filteredTodos).forEach((status) => {
      filteredTodos[status] = filteredTodos[status].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
  }

  return (
    <>
      <Navbar page={"home"} />
      <div className="px-5 py-5 md:px-12 ">
        <button
          className="px-16 py-2 font-semibold text-center text-white bg-blue-500 rounded-md"
          onClick={() => setShowAddTodo(true)}
        >
          Add Task
        </button>

        <div className="flex justify-between items-center border-[1px] border-gray-300 py-4 mt-4">
          <div className="flex items-center gap-2 px-3">
            <h1 className="font-semibold">Search:</h1>
            <input
              type="text"
              placeholder="Search"
              className="border-[1px] border-gray-300 py-1.5 px-2 outline-none w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-3">
            <h1 className="font-semibold">Sort by:</h1>
            <select
              className="border-[1px] border-gray-300 py-1.5 px-2 outline-none w-28"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Recent">Recent</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col justify-center px-3 my-8 md:flex-row md:justify-around">
          {Object.keys(filteredTodos).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border-[1px] border-gray-300 rounded-lg p-4 md:w-[30vw]"
                >
                  <h2 className="px-3 py-2 text-lg font-semibold text-white bg-blue-500">
                    {status}
                  </h2>
                  {filteredTodos[status].map((todo, index) => {
                    if (!todo || !todo._id) return null;

                    return (
                      <Draggable
                        key={todo._id.toString()}
                        draggableId={todo._id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 my-4 bg-blue-200 border border-gray-200 rounded-md shadow"
                          >
                            <h3 className="text-xl font-bold text-black">
                              Task: {todo.content}
                            </h3>
                            <p className="text-slate-700 mt-1.5">
                              Description: {todo.description}
                            </p>
                            <p className="mt-5 text-sm text-gray-600">
                              Created At: {todo.createdAt}
                            </p>
                            <div className="flex justify-end mt-3 space-x-3">
                              <button
                                onClick={() => handleDelete(todo._id, status)}
                                className="px-2 py-1 text-sm text-white bg-red-500 rounded-md"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => handleEdit(todo._id, status)}
                                className="px-2 py-1 text-sm text-white bg-blue-400 rounded-md"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleViewDetails(todo._id, status)
                                }
                                className="px-2 py-1 text-sm text-white bg-green-500 rounded-md"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {isLoading && <Loader />}
      {selectedTodo && <Model todo={selectedTodo} closeModel={closeModel} />}
      {editingTodo && (
        <EditModel
          todo={editingTodo}
          onSave={handleSaveEdit}
          onClose={closeEditModel}
        />
      )}

      {showAddTodo && (
        <AddTodo onClose={closeAddTodoModel} onAddTodo={handleAddTodo} />
      )}
    </>
  );
}
