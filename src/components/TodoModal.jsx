import { useCallback, useEffect, useState } from "react";
import { useNavigation, useSubmit } from "react-router-dom";
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
 * onClose: () => void}} props
 * @returns
 */
const TodoModal = (props) => {
  const [LS, setLS] = useState(props.edit || newToDo());
  const [refresh, volkey] = useRefresh();
  const submit = useSubmit();
  const [open, setOpen] = useState(!!props.edit);
  const [loading, setLoading] = useState(false);
  const navi = useNavigation();

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

    setLoading(true);
    submit(data, { method: props.edit ? "PUT" : "POST" });
  }

  useEffect(() => {
    if (navi.state === "idle" && loading) {
      setLoading(false);
      handleCancel(true);
    }
  }, [loading, navi.state, handleCancel]);

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
        <form onSubmit={handleSubmit} key={volkey}>
          <Input
            _store={LS}
            _store_var={"text"}
            _type={"text"}
            _required
            _label={"Text message"}
            _disabled={loading}
          />
          <Input
            _store={LS}
            _store_var={"due_date"}
            _type={"date"}
            _label={"Due date (optional)"}
            _disabled={loading}
          />
          <Input
            _store={LS}
            _store_var={"priority"}
            _select_from={["LOW", "MEDIUM", "HIGH"]}
            _required
            _label={"Priority"}
            _disabled={loading}
          />

          <button disabled={loading}>
            {loading ? "Loading..." : "Save Item"}
          </button>

          <button type={"button"} disabled={loading} onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
};

export default TodoModal;
