import { useState } from "react";
import { Form, useActionData } from "react-router-dom";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /** @type {null | { error: string }} */
  const actionData = useActionData();

  return (
    <div>
      <h1>Login</h1>

      <Form action="/login" method="POST">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {actionData?.error && <p>{actionData.error}</p>}

        <button type="submit">Login</button>
      </Form>
    </div>
  );
};

export default LoginScreen;
