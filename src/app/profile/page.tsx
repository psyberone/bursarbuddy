"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: number;
  email: string;
  fullName: string;
  campusAddress: string;
  phone: string;
  studentId: string;
  bankLast4: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // The session cookie tells the API who we are.
    fetch("/api/users/1")
      .then((response) => (response.ok ? response.json() : null))
      .then(setProfile);
  }, []);

  if (!profile) return <main><p>Loading…</p></main>;

  return (
    <main>
      <h1>{profile.fullName}</h1>
      <dl>
        <dt>Email</dt><dd>{profile.email}</dd>
        <dt>Address</dt><dd>{profile.campusAddress}</dd>
        <dt>Phone</dt><dd>{profile.phone}</dd>
        <dt>Student ID</dt><dd>{profile.studentId}</dd>
        <dt>Bank</dt><dd>•••• {profile.bankLast4}</dd>
      </dl>
    </main>
  );
}
