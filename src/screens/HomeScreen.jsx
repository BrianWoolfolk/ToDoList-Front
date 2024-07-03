import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";

const HomeScreen = () => {
  return (
    <>
      <nav>
        <NavLink to={"/"}>Go Home</NavLink>
        <NavLink to={"/todos"}>Go App</NavLink>
      </nav>

      <Outlet />
    </>
  );
};

export default HomeScreen;
