import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/styles.css";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import TodosScreen from "./screens/TodosScreen";
import { GET, GETID, POST, PUT, randomTodo } from "./utils/SimulateBack";
import { parseNumber } from "./scripts/scripts";
import TodoModal from "./components/TodoModal";

/**
 * GET endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function loadTodos(req) {
  const url = new URL(req.request.url);

  const pag = url.searchParams.get("pag") ?? 1;
  const done = url.searchParams.get("done");
  const filt = {
    text: url.searchParams.get("text") || null,
    done: done === "false" ? false : done === "true" ? true : null,
    priority: url.searchParams.get("priority") || null,
  };

  return await GET(parseNumber(pag), filt);
}

/**
 * POST endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function loadTodoByID(req) {
  const data = await loadTodos(req);

  const { id } = req.params;
  const single = await GETID(id);

  if (!single)
    throw new Response("Not Found", {
      status: 404,
      statusText: "To Do element not found",
    });

  return { ...data, single };
}

/**
 * POST endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function createTodo(req) {
  const data = await req.request.formData();

  const id = data.get("id");
  const text = data.get("text");
  const priority = data.get("priority");
  const due_date = data.get("due_date");

  let response = false;
  if (req.request.method === "POST") {
    response = await POST(text, priority, due_date);
  } else if (req.request.method === "PUT") {
    response = await PUT(id, text, priority, due_date);
  }

  if (!response)
    throw new Response("Bad Request", {
      status: 402,
      statusText: "Missing or invalud fields passed",
    });
  return null;
}

/** @type {import("./utils/SimulateBack").ToDo[]} */
export const DB = randomTodo(45);

function App() {
  return (
    <div className="App">
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            errorElement: <NotFoundScreen />,
            element: <HomeScreen />,
            children: [
              {
                index: true,
                element: (
                  <div>
                    <h2>Template screen</h2>
                    <Link to={"/todos"}>Go to app</Link>
                  </div>
                ),
              },
              {
                path: "/todos",
                loader: loadTodos,
                action: createTodo,
                element: <TodosScreen />,
                children: [
                  {
                    path: ":id",
                    loader: loadTodoByID,
                    action: undefined,
                    element: <TodoModal edit />,
                  },
                  {
                    path: ":id/:status",
                    loader: undefined,
                    action: undefined,
                    element: <>and status</>,
                  },
                ],
              },
            ],
          },
          {
            path: "*",
            element: <NotFoundScreen />,
          },
        ])}
      />
    </div>
  );
}

export default App;
