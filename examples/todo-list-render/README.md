# Todo List - RivetKit on Render

A simple todo list app demonstrating RivetKit actors deployed to Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/rivet-dev/rivet/tree/main/examples/todo-list-render)

## Features

- Add, complete, and delete todos
- Real-time sync across all connected clients
- Persistent state that survives restarts
- One-click deploy to Render

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Render

1. Click the "Deploy to Render" button above
2. After deployment, set environment variables in the Render dashboard:
   - `RIVET_ENDPOINT` - Your Rivet endpoint
   - `RIVET_PUBLIC_ENDPOINT` - Your Rivet public endpoint

See the [Render deployment guide](https://rivet.dev/docs/connect/render) for details.

## Actor Actions

- `addTodo(text)` - Add a new todo
- `toggleTodo(id)` - Toggle completion status
- `deleteTodo(id)` - Delete a todo
- `getTodos()` - Get all todos
- `clearCompleted()` - Remove completed todos
