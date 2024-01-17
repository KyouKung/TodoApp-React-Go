import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  //Fetching Data
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState();
  const [updateDone, setUpdateDone] = useState(false);

  //Form
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const [updateTitle, setUpdateTitle] = useState();
  const [updateContent, setUpdateContent] = useState();

  //Popup
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const getTodos = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/todos");
      setTodos(result.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  //Popup Create
  const createPopup = () => {
    setShowCreatePopup(true);
  };
  const closeCreatePopup = () => {
    setTitle("");
    setContent("");
    setShowCreatePopup(false);
  };

  //Popup Update
  const updatePopup = async (todoId) => {
    setShowUpdatePopup(true);
    try {
      const result = await axios.get(
        `http://localhost:8080/api/todos/${todoId}`
      );
      setTodo(result.data.data);
      setUpdateTitle(result.data.data.title);
      setUpdateContent(result.data.data.content);
      setUpdateDone(result.data.data.done);
    } catch (error) {
      console.error("Error fetching todo", error);
    }
  };
  const closeUpdatePopup = () => {
    setShowUpdatePopup(false);
  };

  //Popup Delete
  const deletePopup = async (todoId) => {
    setShowDeletePopup(true);
    try {
      const result = await axios.get(
        `http://localhost:8080/api/todos/${todoId}`
      );
      setTodo(result.data.data);
      setUpdateTitle(result.data.data.title);
      setUpdateContent(result.data.data.content);
      setUpdateDone(result.data.data.done);
    } catch (error) {
      console.error("Error fetching todo", error);
    }
  };
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
  };

  // Handle Delete
  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${todoId}`);
      getTodos();
      closeDeletePopup();
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:8080/api/todos/`, { title, content });
      closeCreatePopup();
      getTodos();
    } catch (error) {
      console.error("Error Create todo", error);
    }
  };

  // Handle Update
  const handleUpdate = async (todoId) => {
    try {
      await axios.put(`http://localhost:8080/api/todos/${todoId}`, {
        title: updateTitle,
        content: updateContent,
        done: updateDone,
      });
      closeUpdatePopup();
      getTodos();
    } catch (error) {
      console.error("Error Update todo", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <div className="w-screen h-screen bg-gray-100 flex flex-col">
        <div className="flex justify-center">
          <h1 className="text-[36px] font-bold py-6">To do List</h1>
        </div>
        <div className="flex flex-row justify-center items-center">
          <div className="w-[500px] bg-gray-300 rounded-md flex flex-col justify-start items-center py-4 space-y-4">
            <div className="w-[500px] pl-4 font-bold">To Do</div>
            {!todos || todos.length === 0 ? (
              <h1>Loading</h1>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="w-[470px] h-[80px] bg-white rounded-md drop-shadow-md flex flex-col justify-center px-10 relative"
                >
                  <div className="absolute left-3 top-7">
                    {todo.done === true ? "🟩" : "🟥"}
                  </div>
                  <h1 className="text-xl" onClick={() => updatePopup(todo.id)}>
                    {todo.title.length > 20
                      ? `${todo.title.slice(0, 100)}...`
                      : todo.title}
                  </h1>
                  <p className="text-sm">
                    {todo.content.length > 100
                      ? `${todo.content.slice(0, 100)}...`
                      : todo.content}
                  </p>
                  <button
                    className="absolute top-7 right-4 z-30"
                    onClick={() => deletePopup(todo.id)}
                  >
                    ❌
                  </button>
                </div>
              ))
            )}
            <div className="w-[470px] flex justify-start items-start">
              <button className="font-semibold" onClick={() => createPopup()}>
                + Add a card
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="w-[500px] h-[350px] bg-white flex flex-col justify-evenly items-center drop-shadow-md rounded-xl relative"
          >
            <label className="flex flex-col">
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-[450px] h-[38px] border border-grey-300 mt-2 rounded-lg hover:border-blue-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </label>
            <label className="flex flex-col">
              Content
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-[450px] h-[100px] border border-grey-300 mt-2 rounded-lg hover:border-blue-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </label>
            <button
              type="submit"
              className="w-[450px] h-[44px] rounded-lg text-white bg-blue-600 hover:bg-blue-800"
            >
              Create
            </button>
            <button
              className="absolute top-2 right-2"
              onClick={() => closeCreatePopup()}
            >
              ❌
            </button>
          </form>
        </div>
      )}

      {showUpdatePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {!todo || todo.length === 0 ? (
            <h1>Loading</h1>
          ) : (
            <form
              onSubmit={() => handleUpdate(todo.id)}
              className="w-[500px] h-[350px] bg-white flex flex-col justify-evenly items-center drop-shadow-md rounded-xl relative"
            >
              <label className="flex flex-col">
                Title
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-[450px] h-[38px] border border-grey-300 mt-2 rounded-lg hover:border-blue-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </label>
              <label className="flex flex-col">
                Content
                <input
                  type="text"
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-[450px] h-[100px] border border-grey-300 mt-2 rounded-lg hover:border-blue-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </label>
              <label>
                Done:
                <input
                  type="checkbox"
                  checked={updateDone}
                  onChange={(e) => setUpdateDone(e.target.checked)}
                  className="ml-2"
                />
              </label>
              <button
                type="submit"
                className="w-[450px] h-[44px] rounded-lg text-white bg-blue-600 hover:bg-blue-800"
              >
                Update
              </button>
              <button
                className="absolute top-2 right-2"
                onClick={() => closeUpdatePopup()}
              >
                ❌
              </button>
            </form>
          )}
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {!todo || todo.length === 0 ? (
            <h1>Loading</h1>
          ) : (
            <div className="w-[380px] h-[230px] bg-white flex flex-col justify-evenly items-center drop-shadow-md rounded-xl relative">
              <div className="text-[36px]">Confirm Delete</div>
              <div className="space-x-4">
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="w-[130px] h-[44px] rounded-lg text-white bg-blue-600 hover:bg-blue-800"
                >
                  Confirm
                </button>
                <button
                  onClick={() => closeDeletePopup()}
                  className="w-[130px] h-[44px] rounded-lg border-2 border-blue-600 hover:bg-blue-100"
                >
                  Close
                </button>
              </div>
              <button
                className="absolute top-2 right-2"
                onClick={() => closeDeletePopup()}
              >
                ❌
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
