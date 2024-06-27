import { useLocation, useNavigate } from "react-router";
import { intoInputDate } from "../scripts/scripts";

/**
 *
 * @param {{
 * data: import("../utils/SimulateBack").ToDo[],
 * page: number,
 * maxpage: number,
 * onEdit: () => void,
 * onDelete: () => void}} props
 * @returns
 */
const ShowTable = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  function r(p) {
    const s = new URLSearchParams(location.search);
    s.set("pag", p);
    return () => navigate(`${location.pathname}?${s}`);
  }

  return (
    <>
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
          {props.data.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.done ? "YES" : "NO"}</td>
                <td>{item.text}</td>
                <td>{item.priority}</td>
                <td>{item.due_date ? intoInputDate(item.due_date) : "-"}</td>
                <td>
                  <button onClick={() => props.onEdit?.(item)}>Edit</button>/
                  <button onClick={() => props.onDelete?.(item)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr />
      <div>
        <button onClick={r(1)}>⇤</button>

        {props.page - 1 >= 1 && (
          <>
            <button onClick={r(props.page - 1)}>◀︎</button>
            {props.page - 1 > 1 && "..."}
            <button onClick={r(props.page - 1)}>{props.page - 1}</button>
          </>
        )}

        <b>{props.page}</b>

        {props.page + 1 <= props.maxpage && (
          <>
            <button onClick={r(props.page + 1)}>{props.page + 1}</button>
            {props.page + 1 < props.maxpage && "..."}
            <button onClick={r(props.page + 1)}>▶︎</button>
          </>
        )}

        <button onClick={r(props.maxpage)}>⇥</button>
      </div>
    </>
  );
};

export default ShowTable;
