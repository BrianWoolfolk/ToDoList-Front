import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/styles.css";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import TodosScreen from "./screens/TodosScreen";
import { GET, POST, randomTodo } from "./utils/SimulateBack";
import { parseNumber } from "./scripts/scripts";

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
async function createTodo(req) {
  const data = await req.request.formData();

  const resp = await POST(
    data.get("text"),
    data.get("priority"),
    data.get("due_date")
  );
  console.log(resp);
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
                    loader: undefined,
                    action: undefined,
                    element: <>with id</>,
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
