import { useLocation, useNavigate } from "react-router";
import { intoInputDate } from "../scripts/scripts";
import { useFetcher } from "react-router-dom";
import { useState } from "react";

/** SHORTCUT */
const NEXT = { true: false, false: null, null: true };

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
  const fetcher = useFetcher();
  const [sortPriority, setSortPriority] = useState(null);
  const [sortDueDate, setSortDueDate] = useState(null);

  function r(p) {
    const s = new URLSearchParams(location.search);
    s.set("pag", p);
    return () => navigate(`${location.pathname}?${s}`);
  }

  function applyFilters(is_prior) {
    const prio = is_prior ? NEXT[sortPriority] : sortPriority;
    const duedat = !is_prior ? NEXT[sortDueDate] : sortDueDate;

    const s = new URLSearchParams(location.search);
    s.set("sortPriority", prio ?? "");
    s.set("sortDueDate", duedat ?? "");

    setSortPriority(prio);
    setSortDueDate(duedat);

    navigate(`${location.pathname}?${s}`);
  }

  function handleToggleAll(e) {
    if (fetcher.state !== "idle") return;

    const markAs = e.target.checked;
    const s = new URLSearchParams(location.search);
    const page = s.get("pag") || "1";
    fetcher.submit(null, {
      action: `/todos/0/${markAs ? "done" : "undone"}?inPage=${page}`,
      method: markAs ? "POST" : "PUT",
    });
  }

  return (
    <>
      <table className="show-table">
        <colgroup>
          <col style={{ width: "1%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "1%" }} />
          <col style={{ width: "1%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={props.data?.every((item) => item.done)}
                disabled={fetcher.state !== "idle"}
                onChange={handleToggleAll}
              />
            </th>
            <th>Name</th>
            <th>
              {"Priority "}
              <button onClick={() => applyFilters(true)}>
                {sortPriority === null ? "◉" : sortPriority ? "▼" : "▲"}
              </button>
            </th>
            <th>
              {"Due Date "}
              <button onClick={() => applyFilters(false)}>
                {sortDueDate === null ? "◉" : sortDueDate ? "▼" : "▲"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.data && props.data.length ? (
            props.data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input
                      type={"checkbox"}
                      checked={item.done}
                      disabled={fetcher.state !== "idle"}
                      onChange={() => {
                        if (fetcher.state !== "idle") return;

                        fetcher.submit(null, {
                          action:
                            "/todos/" +
                            item.id +
                            (item.done ? "/undone" : "/done"),
                          method: item.done ? "PUT" : "POST",
                        });
                      }}
                    />
                  </td>

                  <td>{item.text}</td>
                  <td>{item.priority}</td>
                  <td>{item.due_date ? intoInputDate(item.due_date) : "-"}</td>
                  <td>
                    <button onClick={() => props.onEdit?.(item)}>Edit</button>/
                    <button
                      onClick={() => {
                        if (fetcher.state !== "idle") return;

                        fetcher.submit(null, {
                          action: `/todos/${item.id}/delete`,
                          method: "DELETE",
                        });
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>Empty!</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
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
