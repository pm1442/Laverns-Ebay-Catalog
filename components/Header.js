import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          <img src="/logo.jpg" alt="MSK Industrial Services LLC" />
        </Link>
      </div>
    </header>
  );
}
