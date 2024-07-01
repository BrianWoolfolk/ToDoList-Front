import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const SearchControls = () => {
  const navi = useLocation();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [priority, setPriority] = useState("");
  const [done, setDone] = useState("");

  const handleText = (e) => setText(e.target.value);
  const handlePriority = (e) => setPriority(e.target.value);
  const handleState = (e) => setDone(e.target.value);

  function handleSearch() {
    let url = navi.pathname;
    url += `?text=${text}&priority=${priority}&done=${done}`;
    navigate(url);
  }

  return (
    <div className="search-controls">
      <label htmlFor="name">Name</label>
      <input type="text" id="name" placeholder="text" onChange={handleText} />

      <label htmlFor="priority">Priority</label>
      <select name="priority" id="priority" onChange={handlePriority}>
        <option value={""}>All</option>
        <option value={"HIGH"}>High</option>
        <option value={"MEDIUM"}>Medium</option>
        <option value={"LOW"}>Low</option>
      </select>

      <label htmlFor="done">State</label>
      <select name="done" id="done" onChange={handleState}>
        <option value={""}>All</option>
        <option value={"true"}>Done</option>
        <option value={"false"}>Undone</option>
      </select>

      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchControls;
