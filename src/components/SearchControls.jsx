import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Filters } from "../utils/SimulateBack";
import { fromInputDate, intoInputDate } from "../scripts/scripts";

const SearchControls = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(new Filters());

  const updateSearch = (key, value) => {
    const fil = new Filters();
    fil.createFromObject(filters);
    fil[key] = value;
    setFilters(fil);
  };

  function handleSearch(e, reset = false) {
    e.preventDefault();

    const s = new URLSearchParams(location.search);

    const newURLSearchParams = filters.createURLSearchParams();
    newURLSearchParams.forEach((value, key) => {
      if (value === "" || value === undefined || reset) {
        s.delete(key);
      } else s.set(key, value);
    });

    s.set("pag", "0"); // RESET PAGINATION
    if (reset) {
      setFilters(new Filters());
    }

    navigate(`${location.pathname}?${s}`);
  }

  return (
    <form className="search-controls" onSubmit={handleSearch}>
      <label htmlFor="name">Text</label>
      <input
        type="text"
        id="name"
        placeholder="text"
        value={filters.text || ""}
        maxLength={120}
        onChange={(e) => updateSearch("text", e.target.value)}
      />

      <label htmlFor="priority">Priority</label>
      <select
        name="priority"
        id="priority"
        value={filters.priority || ""}
        onChange={(e) => updateSearch("priority", e.target.value)}
      >
        <option value={""}>All</option>
        <option value={"HIGH"}>High</option>
        <option value={"MEDIUM"}>Medium</option>
        <option value={"LOW"}>Low</option>
      </select>

      <label htmlFor="done">State</label>
      <select
        name="done"
        id="done"
        value={filters.done === undefined ? "" : filters.done}
        onChange={(e) => updateSearch("done", e.target.value)}
      >
        <option value={""}>All</option>
        <option value={"true"}>Done</option>
        <option value={"false"}>Undone</option>
      </select>

      <label htmlFor="due_date">Due Date from</label>
      <input
        type="date"
        id="due_date"
        value={intoInputDate(filters.dueDateFrom || "")}
        onChange={(e) =>
          updateSearch("dueDateFrom", fromInputDate(e.target.value))
        }
      />

      <label htmlFor="due_date_to">Due Date to</label>
      <input
        type="date"
        id="due_date_to"
        value={intoInputDate(filters.dueDateTo || "")}
        onChange={(e) =>
          updateSearch("dueDateTo", fromInputDate(e.target.value))
        }
      />

      <label htmlFor="tags">Tags</label>
      <input
        type="text"
        id="tags"
        placeholder="tags"
        value={filters.tags || ""}
        onChange={(e) => updateSearch("tags", e.target.value.split(","))}
      />

      <label htmlFor="assigned_user">Assigned User</label>
      <input
        type="text"
        id="assigned_user"
        placeholder="assigned_user"
        value={filters.assignedUser || ""}
        onChange={(e) => updateSearch("assignedUser", e.target.value)}
      />

      <label htmlFor="creation_date">Creation Date from</label>
      <input
        type="date"
        id="creation_date"
        value={intoInputDate(filters.creationDateFrom || "")}
        onChange={(e) =>
          updateSearch("creationDateFrom", fromInputDate(e.target.value))
        }
      />

      <label htmlFor="creation_date_to">Creation Date to</label>
      <input
        type="date"
        id="creation_date_to"
        value={intoInputDate(filters.creationDateTo || "")}
        onChange={(e) =>
          updateSearch("creationDateTo", fromInputDate(e.target.value))
        }
      />

      <label htmlFor="done_date">Done Date from</label>
      <input
        type="date"
        id="done_date"
        value={intoInputDate(filters.doneDateFrom || "")}
        onChange={(e) =>
          updateSearch("doneDateFrom", fromInputDate(e.target.value))
        }
      />

      <label htmlFor="done_date_to">Done Date to</label>
      <input
        type="date"
        id="done_date_to"
        value={intoInputDate(filters.doneDateTo || "")}
        onChange={(e) =>
          updateSearch("doneDateTo", fromInputDate(e.target.value))
        }
      />

      <button className="primary">Search</button>
      <button
        className="secondary reset-button"
        type="button"
        onClick={(e) => handleSearch(e, true)}
      >
        Reset Search
      </button>
    </form>
  );
};

export default SearchControls;
