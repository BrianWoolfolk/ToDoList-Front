import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const SearchControls = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [priority, setPriority] = useState("");
  const [done, setDone] = useState("");

  const handleText = (e) => setText(e.target.value);
  const handlePriority = (e) => setPriority(e.target.value);
  const handleState = (e) => setDone(e.target.value);

  function handleSearch(e, t = text, p = priority, d = done) {
    e.preventDefault();

    const s = new URLSearchParams(location.search);
    s.set("text", t);
    s.set("priority", p);
    s.set("done", d);

    s.set("pag", "1"); // RESET PAGINATION

    // SYNC SEARCH JUST IN CASE
    setText(t);
    setPriority(p);
    setDone(d);

    navigate(`${location.pathname}?${s}`);
  }

  return (
    <form className="search-controls" onSubmit={handleSearch}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        placeholder="text"
        value={text}
        onChange={handleText}
      />

      <label htmlFor="priority">Priority</label>
      <select
        name="priority"
        id="priority"
        value={priority}
        onChange={handlePriority}
      >
        <option value={""}>All</option>
        <option value={"HIGH"}>High</option>
        <option value={"MEDIUM"}>Medium</option>
        <option value={"LOW"}>Low</option>
      </select>

      <label htmlFor="done">State</label>
      <select name="done" id="done" value={done} onChange={handleState}>
        <option value={""}>All</option>
        <option value={"true"}>Done</option>
        <option value={"false"}>Undone</option>
      </select>

      <button className="primary">Search</button>
      <button
        className="secondary reset-button"
        type="button"
        onClick={(e) => handleSearch(e, "", "", "")}
      >
        Reset Search
      </button>
    </form>
  );
};

export default SearchControls;
