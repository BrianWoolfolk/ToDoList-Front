import { useLoaderData } from "react-router";
import SearchControls from "../components/SearchControls";
import TodoModal from "../components/TodoModal";
import ShowTable from "../components/ShowTable";
import { useState } from "react";
import { useRefresh } from "../scripts/scripts";
import ShowMetrics from "../components/ShowMetrics";

const TodosScreen = () => {
  /** @type {import("../utils/SimulateBack").ToDo[]} */
  const { data, page, maxpage, lastMetrics } = useLoaderData();
  const [editToDo, setEditToDo] = useState(null);
  const [refresh, volkey] = useRefresh();

  function handleEdit(todo) {
    setEditToDo({ ...todo });
    refresh();
  }

  // const handleDelete = (todo) => console.log(todo);

  function handleCloseModal() {
    setEditToDo(null);
    refresh();
  }

  return (
    <>
      <div className="screen">
        <h1>TODOS SCREEN</h1>

        <SearchControls />

        <TodoModal edit={editToDo} key={volkey} onClose={handleCloseModal} />

        <ShowTable
          data={data}
          page={page}
          maxpage={maxpage}
          onEdit={handleEdit}
          // onDelete={handleDelete}
        />
      </div>

      <ShowMetrics metrics={lastMetrics} />
    </>
  );
};

export default TodosScreen;
