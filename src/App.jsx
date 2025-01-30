import { useState, useEffect } from "react";
import "./App.css";

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);

  const getTask = async () => {
    try {
      const res = await fetch("http://localhost:3000/");
      const jsonData = await res.json();
      console.log(jsonData);
      if (jsonData && Array.isArray(jsonData.message)) {
        setTodos(jsonData.message);
      } else {
        console.error("Unexpected API response format", jsonData);
        setTodos([]);
      }
    } catch (err) {
      console.error("Error fetching tasks: ", err);
      setTodos([]);
    }
  };

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      const res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task }),
      });
      const jsonData = await res.json();
      console.log(jsonData);
      if (jsonData && jsonData.title) {
        setTodos([...todos, jsonData]);
        setTask("");
      }
    } catch (err) {
      console.error("Error adding task: ", err);
    }
  };

  const editTask = async () => {
    if (!task.trim()) return;
    try {
      const updatedTask = { id: editTaskId, title: task };
      const res = await fetch(`http://localhost:3000/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      const jsonData = await res.json();
      console.log("Task updated:", jsonData);
      if (jsonData && jsonData.updatedTask) {
        setTodos(
          todos.map((todo) =>
            todo.id === editTaskId ? jsonData.updatedTask : todo
          )
        );
        setEditTaskId(null);
        setTask("");
      }
    } catch (err) {
      console.error("Error updating task: ", err);
    }
  };

  const startEditing = (id, title) => {
    setEditTaskId(id);
    setTask(title);
  };

  const removeTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
      const jsonData = await res.json();
      console.log("Task removed: ", jsonData);
      if (jsonData) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (err) {
      console.error("Error removing task: ", err);
    }
  };

  useEffect(() => {
    getTask();
  }, [todos]);

  return (
    <div className="app">
      <h1>{editTaskId ? "Edit Task" : "Add Todo Tasks"}</h1>

      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={editTaskId ? "Edit The Task.." : "Enter The Task.."}
        />
        <button onClick={editTaskId ? editTask : addTask}>
          {editTaskId ? "Update" : "+"}
        </button>
      </div>

      <div className="todo-table">
        <div className="table-header">
          <div>ID</div>
          <div>Title</div>
          <div>Actions</div>
        </div>

        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id} className="table-row">
              <div>{todo.id}</div>
              <div>{todo.title}</div>
              <div className="actions">
                <button onClick={() => startEditing(todo.id, todo.title)}>
                  Edit
                </button>
                <button onClick={() => removeTask(todo.id)}>X</button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};
