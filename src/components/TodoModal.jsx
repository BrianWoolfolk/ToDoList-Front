import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import Input from "./Input";
import { useRefresh } from "../scripts/scripts";

/**
 *
 * @returns {import("../utils/SimulateBack").ToDo}
 */
function newToDo() {
  return {
    id: -1,
    text: "",
    due_date: null,
    done: false,
    done_date: null,
    priority: "low",
    creation_date: new Date(),
  };
}

/**
 *
 * @param {{
 * edit: import("../utils/SimulateBack").ToDo?,
 * isDelete: boolean,
 * onClose: () => void}} props
 * @returns
 */
const TodoModal = (props) => {
  const [LS, setLS] = useState(props.edit || newToDo());
  const [refresh, volkey] = useRefresh();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(!!props.edit);
  const [loading, setLoading] = useState(false);

  function handleCreate() {
    if (loading) return;
    setLS(newToDo());
    setOpen(true);
    refresh();
  }

  const handleCancel = useCallback(
    (bypass) => {
      if (loading && !bypass) return;
      setLS({});
      setOpen(false);

      if (props.edit) props.onClose?.();
    },
    [loading, props]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (props.isDelete) {
      return fetcher.submit(null, {
        action: `/todos/${LS.id}/delete`,
        method: "DELETE",
      });
    }

    const data = new FormData();
    data.append("text", LS.text);
    data.append(
      "due_date",
      LS.due_date instanceof Date
        ? LS.due_date.toISOString()
        : LS.due_date || ""
    );
    data.append("priority", LS.priority);
    data.append("id", LS.id);

    fetcher.submit(data, {
      action: "/todos",
      method: props.edit ? "PUT" : "POST",
    });
  }

  useEffect(() => {
    if (fetcher.state === "idle" && loading) {
      setLoading(false);
      handleCancel(true);
    }
  }, [loading, fetcher.state, handleCancel]);

  return (
    <>
      <button
        className="todo-button"
        disabled={props.edit || open || loading}
        onClick={handleCreate}
      >
        {loading ? "Loading..." : "+ New To Do"}
      </button>

      {open && (
        <div className="modal-container">
          <div className="modal">
            <div className="modal-title">
              <h3>
                {props.isDelete ? "Delete" : props.edit ? "Edit" : "Create new"}{" "}
                To Do Item
              </h3>

              <button className="exit" onClick={handleCancel}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} key={volkey}>
              <Input
                _store={props.isDelete ? structuredClone(LS) : LS}
                _store_var={"text"}
                _type={"text"}
                _required
                _label={"Text message"}
                _disabled={loading || props.isDelete}
                _max={120}
              />

              <Input
                _store={props.isDelete ? structuredClone(LS) : LS}
                _store_var={"due_date"}
                _type={"date"}
                _label={"Due date (optional)"}
                _disabled={loading || props.isDelete}
              />

              <Input
                _store={props.isDelete ? structuredClone(LS) : LS}
                _store_var={"priority"}
                _select_from={["LOW", "MEDIUM", "HIGH"]}
                _required
                _label={"Priority"}
                _disabled={loading || props.isDelete}
              />

              <div className="modal-controls">
                <button disabled={loading} className="primary">
                  {loading
                    ? "Loading..."
                    : props.isDelete
                    ? "Delete Item"
                    : "Save Item"}
                </button>

                <button
                  type={"button"}
                  disabled={loading}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoModal;
