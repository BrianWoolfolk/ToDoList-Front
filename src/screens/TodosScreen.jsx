import { Outlet, useLoaderData } from "react-router";
import { intoInputDate } from "../scripts/scripts";
import SearchControls from "../components/SearchControls";
import { Link } from "react-router-dom";

const TodosScreen = () => {
  /** @type {import("../utils/SimulateBack").ToDo[]} */
  const data = useLoaderData();

  return (
    <>
      <h1>TODOS SCREEN</h1>

      <SearchControls />

      {/* <CreateButton /> */}

      <table>
        <thead>
          <tr>
            <th>Done</th>
            <th>Name</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.done ? "YES" : "NO"}</td>
                <td>{item.text}</td>
                <td>{item.priority}</td>
                <td>{item.due_date ? intoInputDate(item.due_date) : "-"}</td>
                <td>
                  <Link to={"/todos/" + item.id}>Edit</Link> / Delete
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Outlet />

      {/* <ShowMetrics /> */}
    </>
  );
};

export default TodosScreen;
