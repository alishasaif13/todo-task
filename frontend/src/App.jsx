import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { toast } from 'react-toastify';

function App() {

  // Task states
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

// Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // Frontend Paginations formula
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTodos = todos.slice(indexOfFirstItem, indexOfLastItem);

  // const totalPages = Math.ceil(todos.length / itemsPerPage);


  // Fetching data
  const fetchTasks = useCallback(() => {
    axios
      .get(`http://localhost:5000/todo?page=${currentPage}&limit=${itemsPerPage}`)
      .then((res) => {
        setTodos(res.data.tasks);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(error => console.log("Fetch error", error));
  }, [currentPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Adding task
  const addTask = () => {
    axios
      .post("http://localhost:5000/todo", { name, description })
      .then((res) => {
        setName("");
        setDescription("");
        toast.success("Task added successfully");
        fetchTasks();
      })
      .catch((error) => console.log("creating me error aa gia", error));
  };

  // Deleting task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/todo/${id}`)
      .then((res) => {
        toast.success("Task deleted successfully");
        fetchTasks();
      })
      .catch(console.log("error aa gia"));
  };

  // Updating task
  const updateTask = () => {
    axios
      .put(`http://localhost:5000/todo/${editId}`, { name, description })
      .then((res) => {
        setEditId(null);
        setName("");
        setDescription("");
        toast.success("Task updated successfully");
        fetchTasks();
      })
      .catch((err) => console.log("updating me error aa gia", err));
  };

  // Enable Edit mode
  const enableEdit = (todo) => {
    setEditId(todo._id);
    setName(todo.name);
    setDescription(todo.description);
  };

  // Disable Edit mode
  const disableEdit = () => {
    setEditId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-8 py-14" style={{ backgroundImage: `url('/back.jpeg')`, backgroundSize: "cover" }}>

      {/* Logo */}
      <span className="absolute  top-2 text-xl font-bold uppercase p-2 text-white bg-green-300/50 rounded-lg">Todo by Lishoo</span>

      <div className="bg-white/50 shadow-lg w-full md:w-4/5 p-4 space-y-4 rounded-xl text-gray-600 duration-200">

        {/* Input */}
        <h1 className="text-4xl font-semibold">Add a new task</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editId ? updateTask() : addTask();
          }}
          className="flex gap-4"
        >
          <div className="w-full space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white rounded-md p-2 outline-pink-300 w-full"
              required
            />
            <textarea
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white rounded-md p-2 outline-pink-300 w-full"
              required
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-2xl">
            <button className="cursor-pointer bg-white p-1 rounded-md">{editId ? "✔️" : "➕"}</button>
            {editId && (<button onClick={disableEdit} className="cursor-pointer bg-white p-1 rounded-md">❌</button>)}
          </div>
        </form>

        {/* Tasks */}
        <h1 className="text-4xl font-semibold">All Todos</h1>
        {todos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todos.map((todo) => (
              <div key={todo._id} className="flex items-center justify-between bg-white rounded-md p-4">
                <div>
                  <h2 className="text-xl font-semibold">{todo.name}</h2>
                  <p className="text-base">{todo.description?.length < 25 ? (todo.description) : (todo.description.slice(0, 25) + "...")}</p>
                  <p className="text-xs mt-2">Created {format(todo.createdAt)}</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-xl">
                  <button onClick={() => enableEdit(todo)} className="cursor-pointer hover:scale-110">✏️</button>
                  <button onClick={() => deleteTask(todo._id)} className="cursor-pointer hover:scale-110">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ) : (<p className="font-semibold">No todos added yet</p>)}

        {/* Pagination buttons */}
        <div className="flex justify-center gap-4 text-lg font-bold">
          <button onClick={() => setCurrentPage(currentPage - 1)} className={currentPage === 1 ? "opacity-50" : "cursor-pointer"} disabled={currentPage === 1}>⬅️</button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => prev + 1)} className={currentPage === totalPages ? "opacity-50" : "cursor-pointer"} disabled={currentPage === totalPages}>➡️</button>
        </div>

      </div>
    </div>
  );
}

export default App;
