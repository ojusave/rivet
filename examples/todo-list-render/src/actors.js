import { actor, setup, event } from "rivetkit";

export const todoList = actor({
	state: {
		todos: [],
	},

	events: {
		todosUpdated: event(),
	},

	actions: {
		addTodo: (c, text) => {
			const todo = {
				id: crypto.randomUUID(),
				text,
				completed: false,
				createdAt: Date.now(),
			};
			c.state.todos.push(todo);
			c.broadcast("todosUpdated", c.state.todos);
			return todo;
		},

		toggleTodo: (c, id) => {
			const todo = c.state.todos.find((t) => t.id === id);
			if (todo) {
				todo.completed = !todo.completed;
				c.broadcast("todosUpdated", c.state.todos);
			}
			return c.state.todos;
		},

		deleteTodo: (c, id) => {
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
