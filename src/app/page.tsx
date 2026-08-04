import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>BursarBuddy</h1>
      <p>Keep track of where your money actually goes at school.</p>
      <p>
        <Link href="/login">Log in</Link> or <Link href="/signup">sign up</Link>
      </p>
    </main>
  );
}
