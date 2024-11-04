import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router-dom";
import "./theme/styles.css";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import TodosScreen from "./screens/TodosScreen";
import {
  fromInputDate,
  intoInputDate,
  parseNumber,
  stall,
} from "./scripts/scripts";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";

export const LOCALHOST = "http://localhost:9090";

/**
 *
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 */
async function checkUser(req) {
  if (GS.token === null) {
    return redirect("/login");
  }

  return null;
}

/**
 * GET endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function loadTodos(req) {
  const res = await checkUser(req);
  if (res) return res;

  const url = new URL(req.request.url);
  url.searchParams.set(
    "pag",
    parseNumber(url.searchParams.get("pag") || "1") - 1
  );
  if (GS.delay) await stall(GS.delay);

  const response = await fetch(`${LOCALHOST}/todos${url.search}`, {
    headers: {
      Authorization: `Bearer ${GS.token}`,
    },
  });
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
  if (GS.delay) await stall(GS.delay);

  const id = data.get("id");
  const text = data.get("text");
  const priority = data.get("priority");
  const due_date = data.get("due_date");
  const tags = data.get("tags");
  const assigned_user = data.get("assigned_user");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${GS.token}`);

  const raw = JSON.stringify({
    text: text ? text.toString() : undefined,
    priority: priority ? priority.toString().toUpperCase() : undefined,
    due_date: due_date
      ? fromInputDate(intoInputDate(due_date))?.toISOString()
      : null,
    tags: tags ? tags.split(",") : null,
    assigned_user: assigned_user || null,
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
  if (GS.delay) await stall(GS.delay);

  const requestOptions = {
    method: req.request.method,
    redirect: "follow",
    headers: {
      Authorization: `Bearer ${GS.token}`,
    },
  };

  let response = null;
  if (status === "all") {
    response = await fetch(`${LOCALHOST}/todos/markAll${s}`, requestOptions);
  } else {
    response = await fetch(
      `${LOCALHOST}/todos/${id}/${status}`,
      requestOptions
    );
  }

  if (!response.ok) throw response;

  return null;
}

/**
 *
 * @param {ActionFunctionArgs} req
 */
async function actionLogin(req) {
  const formdata = await req.request.formData();
  const username = formdata.get("username");
  const password = formdata.get("password");

  const url = new URLSearchParams();
  url.append("username", username);
  url.append("password", password);

  const resp = await fetch(`${LOCALHOST}/api/login?${url}`, {
    method: "POST",
    redirect: "follow",
  }).catch((err) => {
    console.error(err);
    return null;
  });

  if (resp && resp.ok) {
    const data = await resp.text();
    GS.token = data;
    return redirect("/");
  }

  return { error: "Invalid credentials" };
}

/** @type {import("./utils/SimulateBack").ToDo[]} */
export const DB = [];

export const GS = {
  delay: 0,
  token: null,
};

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
            {
              path: "/login",
              loader: undefined,
              action: actionLogin,
              element: <LoginScreen />,
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
