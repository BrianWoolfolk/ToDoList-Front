import { useState } from "react";
import { randomDate, randomRange } from "../scripts/scripts";

const RandomAdd = () => {
  const size = 45;
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    const p = ["HIGH", "MEDIUM", "LOW"];
    for (let i = 0; i < size; i++) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        text: "Texto de ejemplo " + i,
        priority: p[randomRange(0, 2)],
        due_date: Math.random() > 0.5 ? randomDate().toISOString() : null,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:8080/todos",
        requestOptions
      );
      const result = await response.text();
      console.log(result);

      if (response.ok) console.log("success");
      else console.log("error:", i, response);
    }

    setLoading(false);
  }

  return (
    <button
      disabled={loading}
      onClick={() => {
        if (loading) return;
        handleClick();
      }}
    >
      RANDOM ADD
    </button>
  );
};

export default RandomAdd;
