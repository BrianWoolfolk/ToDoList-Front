import { useState } from "react";
import { randomDate, randomRange, stall } from "../scripts/scripts";
import { LOCALHOST, GS } from "../App";

const RandomAdd = () => {
  const size = 45;
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState("");

  async function handleClick() {
    if (loading) return;
    setLoading(1);

    const p = ["HIGH", "MEDIUM", "LOW"];
    for (let i = 0; i < size; i++) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const raw = JSON.stringify({
        text: "Texto de ejemplo " + i,
        priority: p[randomRange(0, 2)],
        due_date:
          Math.random() > 0.5
            ? randomDate(yesterday, nextMonth).toISOString()
            : null,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(LOCALHOST + "/todos", requestOptions).catch(
        (error) => {
          setError(error.data || "Failed to fetch!");
          return null;
        }
      );

      if (response === null) break;
      if (GS.delay) await stall(GS.delay);
      if (!response.ok) console.error("error:", i, response);
      setLoading(i + 1);
    }

    setLoading(0);
  }

  return (
    <>
      <button
        disabled={!!loading}
        onClick={() => {
          if (loading) return;
          handleClick();
        }}
      >
        {loading ? "Sending..." : error || "Random Add (45)"}
      </button>

      {loading ? (
        <div className="spinner">
          Sending {loading} of {size}...
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RandomAdd;
