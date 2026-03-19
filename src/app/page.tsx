"use client";

import styles from "./page.module.css";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  state: string;
}

interface Column {
  key: string;
  title: string;
}

const initialTasks: Task[] = [
  { id: 1, title: "Task 1", description: "This is the first task", state: "todo" },
  { id: 2, title: "Task 2", description: "This is the second task", state: "done" },
  { id: 3, title: "Task 3", description: "This is the third task", state: "todo" },
  { id: 4, title: "Task 4", description: "This is the fourth task", state: "in_progress" },
];

const DEFAULT_COLUMNS: Column[] = [
  { key: "todo", title: "To do" },
  { key: "in_progress", title: "In progress" },
  { key: "done", title: "Done" },
];

function renderTasksFor(
  tasks: Task[],
  columnKey: string,
  columns: Column[],
  editingTask: Task | null,
  editTitle: string,
  editDescription: string,
  setEditTitle: (title: string) => void,
  setEditDescription: (desc: string) => void,
  startEdit: (task: Task) => void,
  saveEdit: () => void,
  cancelEdit: () => void,
  deleteTask: (id: number) => void,
  moveTask: (id: number, newState: string) => void
) {
  const filtered = tasks.filter((task) => task.state === columnKey);

  if (filtered.length === 0) {
    return (
      <p className={styles.taskDescription}>
        No tasks yet. Add your first card to get started.
      </p>
    );
  }

  return (
    <div className={styles.taskList}>
      {filtered.map((task) => (
        <article key={task.id} className={styles.task}>
          {editingTask?.id === task.id ? (
            <div className={styles.editForm}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={styles.editInput}
                placeholder="Task title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className={styles.editTextarea}
                placeholder="Task description"
                rows={3}
              />
              <div className={styles.editActions}>
                <button onClick={saveEdit} className={styles.saveButton}>Save</button>
                <button onClick={cancelEdit} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.taskHeader}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <div className={styles.taskActions}>
                  <button onClick={() => startEdit(task)} className={styles.editButton}>✏️</button>
                  <button onClick={() => deleteTask(task.id)} className={styles.deleteButton}>🗑️</button>
                </div>
              </div>

              <p className={styles.taskDescription}>{task.description}</p>

              <div className={styles.taskMeta}>
                <span className={`${styles.status} ${styles[task.state] ?? ""}`}>
                  {task.state.replace("_", " ")}
                </span>
                <span>#{task.id.toString().padStart(2, "0")}</span>
              </div>

              <div className={styles.moveActions}>
                {columns
                  .filter((col) => col.key !== task.state)
                  .map((col) => (
                    <button
                      key={col.key}
                      onClick={() => moveTask(task.id, col.key)}
                      className={styles.moveButton}
                    >
                      → {col.title}
                    </button>
                  ))}
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [newStateName, setNewStateName] = useState("");

  const addColumn = () => {
    const title = newStateName.trim();
    if (!title) return;
    const key = title.toLowerCase().replace(/\s+/g, "_");
    if (columns.find((c) => c.key === key)) return;
    setColumns([...columns, { key, title }]);
    setNewStateName("");
  };

  const deleteColumn = (key: string) => {
    const fallback = columns.find((c) => c.key !== key)?.key ?? "";
    setTasks(tasks.map((t) => (t.state === key ? { ...t, state: fallback } : t)));
    setColumns(columns.filter((c) => c.key !== key));
  };

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    const newTask: Task = {
      id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: newTaskTitle.trim(),
      description: "New task description",
      state: selectedColumn,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const moveTask = (id: number, newState: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, state: newState } : task)));
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = () => {
    if (!editingTask) return;
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, title: editTitle, description: editDescription }
          : task
      )
    );
    setEditingTask(null);
  };

  const cancelEdit = () => setEditingTask(null);

  return (
    <main className={styles.container}>

      <div className={styles.addTaskForm}>
        <input
          type="text"
          placeholder="Enter new task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className={styles.taskInput}
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className={styles.columnSelect}
        >
          {columns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.title}
            </option>
          ))}
        </select>
        <button onClick={addTask} className={styles.addButton}>
          Add Task
        </button>
      </div>

      <div className={styles.addTaskForm}>
        <input
          type="text"
          placeholder="New state name..."
          value={newStateName}
          onChange={(e) => setNewStateName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addColumn()}
          className={styles.taskInput}
        />
        <button onClick={addColumn} className={styles.addButton}>
          Add State
        </button>
        {columns.map((col) => (
          <button
            key={col.key}
            onClick={() => deleteColumn(col.key)}
            className={styles.deleteButton}
          >
            🗑 {col.title}
          </button>
        ))}
      </div>

      <div className={styles.board}>
        {columns.map((column) => (
          <section key={column.key} className={styles.column}>
            <header className={styles.columnHeader}>
              <h2>{column.title}</h2>
              <span className={styles.badge}>
                {tasks.filter((task) => task.state === column.key).length}
              </span>
            </header>
            {renderTasksFor(
              tasks,
              column.key,
              columns,
              editingTask,
              editTitle,
              editDescription,
              setEditTitle,
              setEditDescription,
              startEdit,
              saveEdit,
              cancelEdit,
              deleteTask,
              moveTask
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
