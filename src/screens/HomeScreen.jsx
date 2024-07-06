import { Outlet, useNavigation } from "react-router";
import { NavLink } from "react-router-dom";

const HomeScreen = () => {
  const navi = useNavigation();

  return (
    <>
      <nav>
        <NavLink to={"/"}>Go Home</NavLink>
        <NavLink to={"/todos"}>Go App</NavLink>
      </nav>

      <Outlet />

      {navi.state !== "idle" && <div className="spinner">{navi.state}...</div>}
    </>
  );
};

export default HomeScreen;
