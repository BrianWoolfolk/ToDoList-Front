import { useState } from "react";
import { useSubmit } from "react-router-dom";
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

  function handleCreate() {
    setLS(newToDo());
    setOpen(true);
    refresh();
  }

  function handleCancel() {
    setLS({});
    setOpen(false);

    if (props.edit) props.onClose?.();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("text", LS.text);
    data.append("due_date", LS.due_date?.toISOString() || "");
    data.append("priority", LS.priority);
    data.append("id", LS.id);

    submit(data, { method: props.edit ? "PUT" : "POST" });
  }

  return (
    <>
      {
        <button disabled={props.edit} onClick={handleCreate}>
          + New To Do
        </button>
      }

      {open && (
        <form onSubmit={handleSubmit} key={volkey}>
          <Input
            _store={LS}
            _store_var={"text"}
            _type={"text"}
            _required
            _label={"Text message"}
          />
          <Input
            _store={LS}
            _store_var={"due_date"}
            _type={"date"}
            _label={"Due date (optional)"}
          />
          <Input
            _store={LS}
            _store_var={"priority"}
            _select_from={["low", "medium", "high"]}
            _required
            _label={"Priority"}
          />

          <button>Save Item</button>

          <button type={"button"} onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
};

export default TodoModal;
