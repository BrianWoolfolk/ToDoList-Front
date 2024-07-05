import { useRouteError } from "react-router";
import { Link } from "react-router-dom";
import { LOCALHOST } from "../App";

const NotFoundScreen = () => {
  const error = useRouteError();

  const errorTitle =
    (error?.status ? error.status + " " : "") + (error?.data || "");
  const errorText = error?.statusText || error?.message;

  if (error) console.warn(error);

  return (
    <div className="screen">
      <h1>Whoops!</h1>
      <h2>{errorTitle || "Something went wrong..."}</h2>

      <h3>{errorText || "Please try again"}</h3>
      <p>
        If the problem persists, check the connection for <b>{LOCALHOST}</b> and
        try again.
      </p>

      <br />
      <Link to={"/"} className="as-button" style={{ margin: 0 }}>
        Go home
      </Link>
    </div>
  );
};

export default NotFoundScreen;
