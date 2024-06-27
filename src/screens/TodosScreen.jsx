import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import { intoInputDate } from "../scripts/scripts";
import SearchControls from "../components/SearchControls";
import { Link } from "react-router-dom";
import TodoModal from "../components/TodoModal";

const TodosScreen = () => {
  /** @type {import("../utils/SimulateBack").ToDo[]} */
  const { data, page, maxpage } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  function r(p) {
    const s = new URLSearchParams(location.search);
    s.set("pag", p);
    return () => navigate(`${location.pathname}?${s}`);
  }

  return (
    <>
      <h1>TODOS SCREEN</h1>

      <SearchControls />

      <TodoModal />

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

      <hr />
      <div>
        <button onClick={r(1)}>⇤</button>

        {page - 1 >= 1 && (
          <>
            <button onClick={r(page - 1)}>◀︎</button>
            {page - 1 > 1 && "..."}
            <button onClick={r(page - 1)}>{page - 1}</button>
          </>
        )}

        <b>{page}</b>

        {page + 1 <= maxpage && (
          <>
            <button onClick={r(page + 1)}>{page + 1}</button>
            {page + 1 < maxpage && "..."}
            <button onClick={r(page + 1)}>▶︎</button>
          </>
        )}

        <button onClick={r(maxpage)}>⇥</button>
      </div>

      <h3>
        page {page} of {maxpage}
      </h3>

      <Outlet />

      {/* <ShowMetrics /> */}
    </>
  );
};

export default TodosScreen;
