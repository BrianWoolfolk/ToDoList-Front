import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./theme/styles.css";
import React from "react";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import TodosScreen from "./screens/TodosScreen";
import { GET } from "./utils/SimulateBack";

/**
 * GET endpoint
 * @param {import("react-router-dom").LoaderFunctionArgs} req
 * @returns
 */
async function loadTodos(req) {
  const url = new URL(req.request.url);

  const data = await GET();

  return data;
}

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
                action: undefined,
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
