import { useRouteError } from "react-router";
import { Link } from "react-router-dom";

const NotFoundScreen = () => {
  const error = useRouteError();
  const errorText = error?.statusText || error?.message;
  if (error) console.warn(error);

  return (
    <div className="screen">
      <h1>Whoops!</h1>
      <h3>{errorText || "Something went wrong..."}</h3>

      <Link to={"/"}>Go back</Link>
    </div>
  );
};

export default NotFoundScreen;
