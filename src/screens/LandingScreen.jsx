import RandomAdd from "../components/RandomAdd";

const LandingScreen = () => {
  return (
    <div className="screen">
      <h2>Landing Screen</h2>

      <p>
        This app uses data directly from the Java Backend, so please make sure
        the server is running and is accessible through <b>localhost:9090/</b>
      </p>

      <br />
      <p>
        Also, you may want to start testing with some items in the DB; this
        button adds <b>45 random</b> registers automatically: <RandomAdd />
      </p>

      <br />
      <p>To go to the main app, use the navbar buttons ^^</p>
    </div>
  );
};

export default LandingScreen;
