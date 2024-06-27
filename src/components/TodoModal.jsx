import { useState } from "react";
import { useSubmit } from "react-router-dom";
import Input from "./Input";

const TodoModal = () => {
  /** @type {import("../utils/SimulateBack").ToDo} */
  const [LS, setLS] = useState({
    id: -1,
    text: "",
    due_date: null,
    done: false,
    done_date: null,
    priority: "low",
    creation_date: new Date(),
  });

  const submit = useSubmit();
  const [open, setOpen] = useState(false);

  function handleClick() {
    setLS({
      id: -1,
      text: "",
      due_date: null,
      done: false,
      done_date: null,
      priority: "low",
      creation_date: new Date(),
    });
    setOpen(true);
  }

  const handleCancel = () => setOpen(false);

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("text", LS.text);
    data.append("due_date", LS.due_date?.toISOString() || "");
    data.append("priority", LS.priority);
    data.append("id", LS.id);

    submit(data, { method: "POST" });
  }

  return (
    <>
      <button onClick={handleClick}>+ New To Do</button>

      {open && (
        <form onSubmit={handleSubmit} noValidate={false}>
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
