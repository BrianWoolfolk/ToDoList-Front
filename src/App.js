import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/styles.css";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import TodosScreen from "./screens/TodosScreen";
import { fromInputDate, intoInputDate } from "./scripts/scripts";
import LandingScreen from "./screens/LandingScreen";

export const LOCALHOST = "http://localhost:9090";

/**
 * GET endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function loadTodos(req) {
  const url = new URL(req.request.url);

  const response = await fetch(`${LOCALHOST}/todos${url.search}`);
  if (!response.ok) throw response;

  return await response.json();
}

/**
 * POST & PUT endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function editTodo(req) {
  const data = await req.request.formData();

  const id = data.get("id");
  const text = data.get("text");
  const priority = data.get("priority");
  const due_date = data.get("due_date");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    text: text ? text.toString() : undefined,
    priority: priority ? priority.toString().toUpperCase() : undefined,
    due_date: due_date
      ? fromInputDate(intoInputDate(due_date)).toISOString()
      : req.request.method === "PUT"
      ? "none"
      : undefined,
  });

  const requestOptions = {
    method: req.request.method,
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let response = null;
  if (req.request.method === "POST") {
    // LAST CHECK
    if (!text || !priority)
      throw new Response("Missing fields", { status: 400 });

    response = await fetch(`${LOCALHOST}/todos`, requestOptions);
  } else if (req.request.method === "PUT") {
    response = await fetch(`${LOCALHOST}/todos/${id}`, requestOptions);
  }

  if (!response.ok) throw response;

  return null;
}

/**
 * POST & PUT endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function toggleDone(req) {
  const { id, status } = req.params;
  const s = new URL(req.request.url).search;

  const requestOptions = {
    method: req.request.method,
    redirect: "follow",
  };

  const response = await fetch(
    `${LOCALHOST}/todos/${id}/${status}${s}`,
    requestOptions
  );

  if (!response.ok) throw response;

  return null;
}

/** @type {import("./utils/SimulateBack").ToDo[]} */
export const DB = [];

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          errorElement: <NotFoundScreen />,
          element: <HomeScreen />,
          children: [
            {
              index: true,
              element: <LandingScreen />,
            },
            {
              path: "/todos",
              loader: loadTodos,
              action: editTodo,
              element: <TodosScreen />,
              children: [
                {
                  path: ":id/:status",
                  loader: undefined,
                  action: toggleDone,
                  element: <></>,
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
  );
}

export default App;
