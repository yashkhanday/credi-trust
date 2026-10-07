import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1769E0] text-lg font-bold text-white shadow-lg">
            C
          </div>

          <div>
            <h1 className="text-xl font-bold leading-none text-[#0B2A5B]">
              CrediTrust
            </h1>
            <p className="mt-1 text-[10px] font-medium tracking-widest text-gray-500">
              CREDIT • LOANS • TRUST
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-[#0B2A5B] transition hover:text-[#1769E0]"
          >
            Home
          </Link>

          <a
            href="#credit-score"
            className="text-sm font-medium text-gray-600 transition hover:text-[#1769E0]"
          >
            Credit Score
          </a>

          <a
            href="#loans"
            className="text-sm font-medium text-gray-600 transition hover:text-[#1769E0]"
          >
            Loans
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-600 transition hover:text-[#1769E0]"
          >
            How It Works
          </a>

          <a
            href="#support"
            className="text-sm font-medium text-gray-600 transition hover:text-[#1769E0]"
          >
            Support
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#0B2A5B] transition hover:bg-blue-50 sm:block"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-[#1769E0] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B2A5B]"
          >
            Get Started
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;