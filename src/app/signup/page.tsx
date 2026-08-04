"use client";

import { useState } from "react";

const FIELDS = [
  ["email", "Email"],
  ["password", "Password"],
  ["fullName", "Full name"],
  ["campusAddress", "Campus address"],
  ["phone", "Phone"],
  ["studentId", "Student ID"],
  ["bankLast4", "Bank account last 4"],
] as const;

export default function SignupPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      window.location.href = "/profile";
    } else {
      setError((await response.json()).error);
    }
  }

  return (
    <main>
      <h1>Sign up</h1>
      <form onSubmit={submit}>
        {FIELDS.map(([name, label]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            type={name === "password" ? "password" : "text"}
            onChange={(e) => setValues({ ...values, [name]: e.target.value })}
          />
        ))}
        <button type="submit">Sign up</button>
      </form>
      {error ? <p>{error}</p> : null}
    </main>
  );
}
