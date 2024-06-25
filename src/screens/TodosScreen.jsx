import { useLoaderData } from "react-router";

const TodosScreen = () => {
  /** @type {import("../utils/SimulateBack").ToDo[]} */
  const data = useLoaderData();

  return (
    <>
      <h1>TODOS SCREEN</h1>
      {/* <SearchControls /> */}

      {/* <CreateButton /> */}

      {/* <ShowTable /> */}

      {/* <ShowMetrics /> */}

      <ol>
        {data.map((item) => (
          <li>{item.text}</li>
        ))}
      </ol>
    </>
  );
};

export default TodosScreen;
