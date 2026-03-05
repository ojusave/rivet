import { actor, setup, event } from "rivetkit";

interface Todo {
	id: string;
	text: string;
	completed: boolean;
	createdAt: number;
}

export const todoList = actor({
	state: {
		todos: [] as Todo[],
	},

	events: {
		todosUpdated: event<Todo[]>(),
	},

	actions: {
		addTodo: (c, text: string) => {
			const todo: Todo = {
				id: crypto.randomUUID(),
				text,
				completed: false,
				createdAt: Date.now(),
			};
			c.state.todos.push(todo);
			c.broadcast("todosUpdated", c.state.todos);
			return todo;
		},

		toggleTodo: (c, id: string) => {
			const todo = c.state.todos.find((t) => t.id === id);
			if (todo) {
				todo.completed = !todo.completed;
				c.broadcast("todosUpdated", c.state.todos);
			}
			return c.state.todos;
		},

		deleteTodo: (c, id: string) => {
			c.state.todos = c.state.todos.filter((t) => t.id !== id);
			c.broadcast("todosUpdated", c.state.todos);
			return c.state.todos;
		},

		getTodos: (c) => c.state.todos,

		clearCompleted: (c) => {
			c.state.todos = c.state.todos.filter((t) => !t.completed);
			c.broadcast("todosUpdated", c.state.todos);
			return c.state.todos;
		},
	},
});

export const registry = setup({
	use: { todoList },
});
