import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask(e) {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;

    setLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: value }),
      });
      setTitle("");
      await loadTasks();
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(task) {
    await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    await loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await loadTasks();
  }

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Taskflow</h1>

      <form onSubmit={createTask} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite uma nova task..."
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 14px", fontSize: 16 }}>
          {loading ? "..." : "Add"}
        </button>
      </form>

      <ul style={{ paddingLeft: 18 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.title}
              </span>
            </label>

            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "auto", padding: "6px 10px" }}
              aria-label={`Deletar ${task.title}`}
              title="Deletar"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p>Nenhuma task ainda. Crie a primeira 🙂</p>}
    </div>
  );
}
