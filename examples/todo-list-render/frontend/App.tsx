import { useState } from "react";
import { createClient, useActor, useActorEvent } from "@rivetkit/react";
import type { registry } from "../src/actors.ts";

const client = createClient<typeof registry>("/api/rivet");

interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: number;
}

function TodoApp() {
	const [{ actor }] = useActor(client, "todoList", "shared-list");
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTodo, setNewTodo] = useState("");

	useActorEvent(actor, "todosUpdated", (updatedTodos) => {
		setTodos(updatedTodos);
	});

	const handleAdd = async () => {
		if (!newTodo.trim()) return;
		await actor.addTodo(newTodo.trim());
		setNewTodo("");
	};

	const handleToggle = async (id: string) => {
		await actor.toggleTodo(id);
	};

	const handleDelete = async (id: string) => {
		await actor.deleteTodo(id);
	};

	const handleClearCompleted = async () => {
		await actor.clearCompleted();
	};

	const completedCount = todos.filter((t) => t.completed).length;

	return (
		<div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "system-ui" }}>
			<h1>Todo List</h1>
			<p style={{ color: "#666" }}>Powered by RivetKit on Render</p>

			<div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleAdd()}
					placeholder="What needs to be done?"
					style={{ flex: 1, padding: 10, fontSize: 16 }}
				/>
				<button onClick={handleAdd} style={{ padding: "10px 20px" }}>
					Add
				</button>
			</div>

			<ul style={{ listStyle: "none", padding: 0 }}>
				{todos.map((todo) => (
					<li
						key={todo.id}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							padding: 10,
							borderBottom: "1px solid #eee",
						}}
					>
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={() => handleToggle(todo.id)}
						/>
						<span
							style={{
								flex: 1,
								textDecoration: todo.completed ? "line-through" : "none",
								color: todo.completed ? "#999" : "inherit",
							}}
						>
							{todo.text}
						</span>
						<button
							onClick={() => handleDelete(todo.id)}
							style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
						>
							×
						</button>
					</li>
				))}
			</ul>

			{todos.length > 0 && (
				<div style={{ marginTop: 20, color: "#666", display: "flex", justifyContent: "space-between" }}>
					<span>
						{todos.length - completedCount} item{todos.length - completedCount !== 1 ? "s" : ""} left
					</span>
					{completedCount > 0 && (
						<button onClick={handleClearCompleted} style={{ border: "none", background: "none", cursor: "pointer", color: "#666" }}>
							Clear completed
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default function App() {
	return <TodoApp />;
}
