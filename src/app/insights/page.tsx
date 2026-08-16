"use client";

import { useEffect, useState } from "react";

type Insights = {
  summary?: string;
  error?: string;
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    // The session cookie tells the API who we are.
    fetch("/api/users/1/insights")
      .then((response) => response.json())
      .then(setInsights);
  }, []);

  if (!insights) return <main><p>Loading…</p></main>;

  return (
    <main>
      <h1>Spending Insights</h1>
      <pre>{insights.summary ?? insights.error}</pre>
    </main>
  );
}
