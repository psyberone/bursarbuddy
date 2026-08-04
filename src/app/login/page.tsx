"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      window.location.href = "/profile";
    } else {
      setError((await response.json()).error);
    }
  }

  return (
    <main>
      <h1>Log in</h1>
      <form onSubmit={submit}>
        <input type="email" value={email} placeholder="Email"
               onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} placeholder="Password"
               onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Log in</button>
      </form>
      {error ? <p>{error}</p> : null}
    </main>
  );
}
