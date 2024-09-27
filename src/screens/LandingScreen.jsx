import RandomAdd from "../components/RandomAdd";
import { GS } from "../App";
import { parseNumber } from "../scripts/scripts";

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
        button adds <b>45 random</b> registers automatically:
      </p>

      <RandomAdd />

      <br />
      <br />
      <hr />
      <br />
      <p>
        In this case, because the server is local, the requests and responses
        are very quick and it would look the data is almost instantly loaded
        and/or submitted. This app has loading screens to prevent data de-sync
        and provide the user info of what's happening at the time.
      </p>

      <br />
      <p>
        Here you can alter a <b>manual delay</b> to showcase this kind of
        functionalities (the loading screen starts right after, but waits 2s to
        become fully visible):
      </p>
      <br />

      <label>
        Set custom delay:{" "}
        <input
          type="number"
          defaultValue={GS.delay}
          min={0}
          max={5000}
          step={100}
          onChange={(e) => {
            const num = parseNumber(e.target.value);
            GS.delay = Math.min(5000, Math.max(num, 0));
          }}
        />
        (Milliseconds)
      </label>

      <br />
      <br />
      <hr />
      <br />
      <p>To go to the main app, use the navbar buttons ^^</p>
    </div>
  );
};

export default LandingScreen;
