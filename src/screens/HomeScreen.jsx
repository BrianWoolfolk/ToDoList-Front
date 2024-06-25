import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div className="screen">
      <Link to={"/"}>Go Home</Link>
      <Outlet />
    </div>
  );
};

export default HomeScreen;
