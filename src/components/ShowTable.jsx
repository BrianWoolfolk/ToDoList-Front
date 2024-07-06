import { useLocation, useNavigate } from "react-router";
import { fromInputDate, intoInputDate } from "../scripts/scripts";
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
    if (p > props.maxpage || p < 1) {
      return () => {};
    }

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

  const pp = props.page;

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
              <button className="as-link" onClick={() => applyFilters(true)}>
                {"Priority "}
                {sortPriority === null ? "◉" : sortPriority ? "▼" : "▲"}
              </button>
            </th>
            <th>
              <button className="as-link" onClick={() => applyFilters(false)}>
                {"Due Date "}
                {sortDueDate === null ? "◉" : sortDueDate ? "▼" : "▲"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.data && props.data.length ? (
            props.data.map((item, index) => {
              // CALCULATE TIME & STRIKETHROUGH
              let cNameStrike = "";
              let cNameDate;
              if (item.done) cNameStrike = "strike";
              else if (item.due_date) {
                const due = fromInputDate(item.due_date);
                const today = new Date();
                const timeDiff = due.getTime() - today.getTime();
                const rawDays = Math.floor(timeDiff / (24000 * 3600));

                if (rawDays <= 7) cNameDate = "urgent";
                else if (rawDays <= 14) cNameDate = "semi-urgent";
                else cNameDate = "no-urgent";
              }

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

                  <td className={cNameStrike}>{item.text}</td>
                  <td className={cNameStrike}>{item.priority}</td>
                  <td className={cNameDate || cNameStrike}>
                    {item.due_date ? intoInputDate(item.due_date) : "-"}
                  </td>

                  <td>
                    <button
                      className="as-link"
                      onClick={() => props.onEdit?.(item)}
                    >
                      Edit
                    </button>
                    /
                    <button
                      className="as-link"
                      onClick={() => props.onDelete?.(item)}
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

      {fetcher.state !== "idle" && (
        <div className="spinner">{fetcher.state}...</div>
      )}

      <div className="pagination">
        <button className="left-most" onClick={r(1)}>
          ⇤
        </button>

        <button className="back" onClick={r(pp - 1)} disabled={pp - 1 < 1}>
          ◀︎
        </button>

        {pp + 1 >= props.maxpage && <span />}
        {pp + 1 > props.maxpage && <span />}

        {pp - 1 >= 1 && (
          <>
            {pp - 1 > 1 && <span>...</span>}
            <button onClick={r(pp - 1)}>{pp - 1}</button>
          </>
        )}

        <button disabled>{pp}</button>

        {pp + 1 <= props.maxpage && (
          <>
            <button onClick={r(pp + 1)}>{pp + 1}</button>
            {pp + 1 < props.maxpage && <span>...</span>}
          </>
        )}

        <button
          className="forward"
          onClick={r(pp + 1)}
          disabled={pp + 1 > props.maxpage}
        >
          ▶︎
        </button>

        <button className="right-most" onClick={r(props.maxpage)}>
          ⇥
        </button>
      </div>
    </>
  );
};

export default ShowTable;
