export const metadata = {
  title: "BursarBuddy",
  description: "Keep track of where your money actually goes at school.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
